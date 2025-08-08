 import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

const dbPromise = open({
  filename: './doadores.db',
  driver: sqlite3.Database
})


async function criarTabelas() {
  const db = await dbPromise
  await db.exec(`
    CREATE TABLE IF NOT EXISTS doadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      cpf TEXT UNIQUE,
      nascimento TEXT,
      telefone TEXT,
      email TEXT,
      motivacao TEXT,
      desejaNoticias TEXT,
      desejaOracoes TEXT,
      autorizaNome TEXT
    );

    CREATE TABLE IF NOT EXISTS doacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpf TEXT,
      modalidade TEXT,
      forma TEXT,
      valor REAL,
      data TEXT,
      FOREIGN KEY(cpf) REFERENCES doadores(cpf)
    );
  `) 
}

criarTabelas()

export { dbPromise }
