import express from 'express'
import cors from 'cors'
import { dbPromise } from './db.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
})

app.get('/doadores', async (req, res) => {
  const db = await dbPromise;

  try {
    const doadores = await db.all('SELECT * FROM doadores');
    res.json(doadores);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.get('/doacoes/:cpf', async (req, res) => {
  const db = await dbPromise
  const { cpf } = req.params

  try {
    const doacoes = await db.all('SELECT * FROM doacoes WHERE cpf = ?', [cpf])
    res.json(doacoes)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.get('/valor-arrecadado', async (req, res) => {
  const db = await dbPromise

  try {
    const total = await db.get('SELECT SUM(valor) as total FROM doacoes')
    res.json(total)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}) 

app.delete('/doadores/:id', async (req, res) => {
  const db = await dbPromise
  const id = req.params.id

  try {
    // Busca o CPF do doador
    const doador = await db.get('SELECT cpf FROM doadores WHERE id = ?', id)
    if (!doador) return res.status(404).json({ erro: 'Doador não encontrado' })

    // Exclui as doações com aquele CPF
    await db.run('DELETE FROM doacoes WHERE cpf = ?', doador.cpf)

    // Exclui o doador
    await db.run('DELETE FROM doadores WHERE id = ?', id)

    res.sendStatus(204)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})




app.post('/cadastro', async (req, res) => {
  const db = await dbPromise
  const {
    nome, cpf, nascimento, telefone, email,
    motivacao, desejaNoticias, desejaOracoes, autorizaNome,
    modalidade, forma, valor
  } = req.body

  try {
    await db.run(`
      INSERT OR IGNORE INTO doadores (nome, cpf, nascimento, telefone, email, motivacao, desejaNoticias, desejaOracoes, autorizaNome)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [nome, cpf, nascimento, telefone, email, motivacao, desejaNoticias, desejaOracoes, autorizaNome])

    await db.run(`
      INSERT INTO doacoes (cpf, modalidade, forma, valor, data)
      VALUES (?, ?, ?, ?, datetime('now'))
    `, [cpf, modalidade, forma, valor])

    res.status(200).json({ mensagem: 'Cadastro e doação salvos com sucesso!' })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})
