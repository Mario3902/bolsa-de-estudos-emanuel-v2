import { MongoClient, Db, Collection } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb+srv://nlua28902:LZ4ikC3q3gtBVLNV@cluster0.r9pzybd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = process.env.DB_NAME || 'bolsa_emanuel_xirimbimbi'

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
  }
  return { client, db }
}

export async function getCollection(collectionName: string): Promise<Collection> {
  const { db } = await connectToDatabase()
  return db.collection(collectionName)
}

// Interfaces para tipagem
export interface Application {
  _id?: string
  nome_completo: string
  email: string
  telefone: string
  bilhete_identidade: string
  data_nascimento: string
  endereco?: string
  situacao_academica: string
  nome_escola: string
  media_final: number
  universidade?: string
  curso?: string
  categoria: string
  carta_motivacao: string
  nome_encarregado?: string
  telefone_encarregado?: string
  status: string
  relevancia_score?: number
  created_at: Date
  updated_at: Date
}

export interface ApplicationDocument {
  _id?: string
  application_id: string
  document_type: string
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  upload_date: Date
}

export interface AdminUser {
  _id?: string
  username: string
  password_hash: string
  email: string
  role: string
  created_at: Date
  last_login?: Date
}

// Função para calcular score de relevância baseado na média
export function calculateRelevanceScore(media_final: number): number {
  // Média mínima é 16, máxima considerada é 20
  // Score vai de 0 a 100
  const minMedia = 16
  const maxMedia = 20
  
  if (media_final < minMedia) return 0
  if (media_final > maxMedia) return 100
  
  return Math.round(((media_final - minMedia) / (maxMedia - minMedia)) * 100)
}

// Função para criar índices necessários
export async function createIndexes() {
  try {
    const applicationsCollection = await getCollection('applications')
    
    // Índices para performance
    await applicationsCollection.createIndex({ email: 1 }, { unique: true })
    await applicationsCollection.createIndex({ bilhete_identidade: 1 }, { unique: true })
    await applicationsCollection.createIndex({ status: 1 })
    await applicationsCollection.createIndex({ categoria: 1 })
    await applicationsCollection.createIndex({ media_final: -1 }) // Descendente para ordenação por relevância
    await applicationsCollection.createIndex({ relevancia_score: -1 })
    await applicationsCollection.createIndex({ created_at: -1 })
    
    console.log('Índices criados com sucesso')
  } catch (error) {
    console.error('Erro ao criar índices:', error)
  }
}

