import express from 'express'

const app = express()
app.use(express.json())

const contatos = [
    {
        id: 1,
        nome: "fulano",
        telefone: "11999999999"
    },
    {
        id: 2,
        nome: "ciclano",
        telefone: "11999999998"
    },
]

app.get('/contatos', (req, res) => {
    res.json(contatos)
})

app.post('/contatos', (req, res) => {
    const { nome, telefone } = req.body
    const novoContato = {
        id: contatos.length + 1,
        nome,
        telefone
    }

    contatos.push(novoContato)

    res.status(201).json(novoContato)
    console.log(novoContato)
})

app.patch('/contatos/:id', (req, res) => {
    const { id } = req.params; 
    const { nome, telefone } = req.body; 

    const contato = contatos.find(c => c.id === parseInt(id));

    if (!contato) {
        return res.status(404).json({ message: 'Contato não encontrado' });
    }

    if (nome) contato.nome = nome;
    if (telefone) contato.telefone = telefone;

    return res.status(200).json(contato);
});

app.delete('/contatos/:id', (req, res) => {
    const { id } = req.params;
    const contatoIndex = contatos.findIndex(c => c.id === parseInt(id));

    if (contatoIndex === -1) {
        return res.status(404).json({ message: 'Contato não encontrado' });
    }

    contatos.splice(contatoIndex, 1);
    res.status(204).send();
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});