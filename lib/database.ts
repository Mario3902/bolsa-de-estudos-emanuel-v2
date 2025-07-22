import { getCollection, Application, calculateRelevanceScore } from './mongodb'
import { ObjectId } from 'mongodb'

// Função para executar queries no MongoDB
export async function executeQuery(operation: string, data?: any, filters?: any) {
  try {
    const collection = await getCollection('applications')
    
    switch (operation) {
      case 'INSERT':
        // Calcular score de relevância
        if (data.media_final) {
          data.relevancia_score = calculateRelevanceScore(data.media_final)
        }
        data.created_at = new Date()
        data.updated_at = new Date()
        const result = await collection.insertOne(data)
        return { insertId: result.insertedId }
        
      case 'SELECT':
        const query: any = {}
        const options: any = {}
        
        // Aplicar filtros
        if (filters) {
          if (filters.search) {
            query.$or = [
              { nome_completo: { $regex: filters.search, $options: 'i' } },
              { email: { $regex: filters.search, $options: 'i' } },
              { bilhete_identidade: { $regex: filters.search, $options: 'i' } }
            ]
          }
          
          if (filters.status && filters.status !== 'todos') {
            query.status = filters.status
          }
          
          if (filters.categoria && filters.categoria !== 'all') {
            query.categoria = filters.categoria
          }
          
          if (filters.media_min) {
            query.media_final = { $gte: parseFloat(filters.media_min) }
          }
          
          if (filters.media_max) {
            query.media_final = { ...query.media_final, $lte: parseFloat(filters.media_max) }
          }
        }
        
        // Ordenação por relevância (média) por padrão
        options.sort = { relevancia_score: -1, media_final: -1, created_at: -1 }
        
        // Paginação
        if (filters?.limit) {
          options.limit = parseInt(filters.limit)
        }
        if (filters?.offset) {
          options.skip = parseInt(filters.offset)
        }
        
        const applications = await collection.find(query, options).toArray()
        return applications
        
      case 'COUNT':
        const countQuery: any = {}
        if (filters) {
          if (filters.search) {
            countQuery.$or = [
              { nome_completo: { $regex: filters.search, $options: 'i' } },
              { email: { $regex: filters.search, $options: 'i' } },
              { bilhete_identidade: { $regex: filters.search, $options: 'i' } }
            ]
          }
          if (filters.status && filters.status !== 'todos') {
            countQuery.status = filters.status
          }
          if (filters.categoria && filters.categoria !== 'all') {
            countQuery.categoria = filters.categoria
          }
        }
        const count = await collection.countDocuments(countQuery)
        return [{ total: count }]
        
      case 'UPDATE':
        if (data.media_final) {
          data.relevancia_score = calculateRelevanceScore(data.media_final)
        }
        data.updated_at = new Date()
        const updateResult = await collection.updateOne(
          { _id: new ObjectId(filters.id) },
          { $set: data }
        )
        return updateResult
        
      case 'DELETE':
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(filters.id) })
        return deleteResult
        
      case 'AGGREGATE':
        // Para agrupamentos e estatísticas
        const pipeline = data || []
        const aggregateResult = await collection.aggregate(pipeline).toArray()
        return aggregateResult
        
      default:
        throw new Error(`Operação não suportada: ${operation}`)
    }
  } catch (error) {
    console.error('Erro na operação da base de dados:', error)
    throw error
  }
}

// Função para obter estatísticas agrupadas
export async function getApplicationStats() {
  try {
    const collection = await getCollection('applications')
    
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          media_geral: { $avg: '$media_final' },
          media_maxima: { $max: '$media_final' },
          media_minima: { $min: '$media_final' },
          pendentes: {
            $sum: { $cond: [{ $eq: ['$status', 'pendente'] }, 1, 0] }
          },
          aprovados: {
            $sum: { $cond: [{ $eq: ['$status', 'aprovado'] }, 1, 0] }
          },
          rejeitados: {
            $sum: { $cond: [{ $eq: ['$status', 'rejeitado'] }, 1, 0] }
          }
        }
      }
    ]).toArray()
    
    const categoriaStats = await collection.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          media_categoria: { $avg: '$media_final' }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray()
    
    const mediaRanges = await collection.aggregate([
      {
        $bucket: {
          groupBy: '$media_final',
          boundaries: [16, 17, 18, 19, 20, 21],
          default: 'Outros',
          output: {
            count: { $sum: 1 },
            media_range: { $avg: '$media_final' }
          }
        }
      }
    ]).toArray()
    
    return {
      geral: stats[0] || {},
      por_categoria: categoriaStats,
      por_media: mediaRanges
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    throw error
  }
}

// Manter compatibilidade com código existente
export async function getConnection() {
  // Esta função não é necessária para MongoDB, mas mantemos para compatibilidade
  return null
}
