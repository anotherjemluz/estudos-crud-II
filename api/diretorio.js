module.exports = app => {
  const { existsOrError, notExistsOrErrror } = app.api.validation

  const salvar = (req, res) => {
    const diretorio = { ...req.body }
    if(req.params.id) diretorio.id = req.params.id

    try {
      existsOrError(diretorio.nome, 'Dê um nome ao seu diretório')
    } catch(msg) {
      return res.status(400).send(msg)
    }

    if(diretorio.id) {
      app.db('diretorios')
        .update(diretorio)
        .where({ id: diretorio.id })
        .then(_ => res.status(204).send('Diretorio atualizado.'))
        .catch(err => res.status(500).send(err))
    } else {
      app.db('diretorios')
        .insert(diretorio)
        .then(_ => res.status(204).send('Diretorio criado.'))
        .catch(err => res.status(500).send(err))
    }
  }

  const excluir = async (req, res) => {
    try {
      existsOrError(req.params.id, 'Codigo do diretorio não informado.')

      // const subdir = await app.db('diretorios')
      //   .where({ parentId: req.params.id })
      // notExistsOrErrror(subdir, 'Diretorio possui subdiretorios.')

      // const arquivo = await app.db('arquivos')
      //   .where({ diretorioId: req.params.id })
      // notExistsOrErrror(arquivo, 'Diretorio possui arquivos.')

      const rowsDeleted = await app.db('diretorios')
        .where({ id: req.params.id }).del()
      existsOrError(rowsDeleted, 'Diretorio não existe.')

      res.status(204).send('Diretorio removido.')
    } catch(msg) {
      res.status(400).send(msg)
    }
  }

  const withPath = diretorios => {
    const getParent = (diretorios, parentId) => {
      const parent = diretorios.filter(parent => parent.id === parentId)
      return parent.length ? parent[0] : null
    }

    const diretoriosWithPath = diretorios.map(diretorio => {
      let path = diretorio.nome
      let parent = getParent(diretorios, diretorio.parentId)

      while(parent) {
        path = `${parent.nome} > ${path}`
        parent = getParent(diretorios, parent.parentId)
      }
  
      return { ...diretorio, path}
    })

    diretoriosWithPath.sort((a, b) => {
      if(a.path < b.path) return -1
      if(a.path > b.path) return 1
      return 0
    })

    return diretoriosWithPath
  }

  const visualizar = (req, res) => {
    app.db('diretorios')
      .then(diretorios => res.json(withPath(diretorios)))
      .catch(err => res.status(500).send(err))
  }

  const visualizarPorId = (req, res) => {
    app.db('diretorios')
      .where({ id: req.params.id })
      .first()
      .then(diretorio => res.json(diretorio))
      .catch(err => res.status(500).send(err))
  }

  const toTree = (diretorios, tree) => {
    if(!tree) tree = diretorios.filter(d => !d.parentId)
    tree = tree.map(parentNode => {
      const isChild = node => node.parentId === parentNode.id
      parentNode.children = toTree(diretorios, diretorios.filter(isChild))
      return parentNode
    })
    return tree
  }

  const getTree = (req, res) => {
    app.db('diretorios')
      .then(diretorios => res.json(toTree(withPath(diretorios))))
  }

  return { salvar, excluir, visualizar, visualizarPorId, getTree }
} 