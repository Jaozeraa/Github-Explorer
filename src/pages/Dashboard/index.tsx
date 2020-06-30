import React, { useState, FormEvent, useEffect } from 'react'
import { Title, Form, Repositories, Error } from './styles'
import logoImg from '../../assets/logo.svg'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import api from '../../services/api'

interface Repository {
    id: number
    full_name: string
    description: string
    owner: {
        login: string
        avatar_url: string
    }
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('')
    const [inputError, setInputError] = useState('')
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories')

        if(storagedRepositories) {
            return JSON.parse(storagedRepositories)
        } else {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
    }, [repositories])

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()
        if(!newRepo){
            return setInputError('Digite autor/nome do repositório')
        }
        try {
            const response = await api.get(`repos/${newRepo}`)
            setNewRepo('')
            setInputError('')
            return setRepositories([ ...repositories, response.data])
        } catch (err) {
            return setInputError('Erro na busca por esse repositório')
        }
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer"/>
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!! inputError} onSubmit={handleAddRepository}>
                <input 
                    placeholder='Digite o nome do repositório'
                    value={newRepo}
                    onChange={e => setNewRepo(e.target.value)}
                />
                <button type="submit">Pesquisar</button>
            </Form>

            { inputError && <Error>{inputError}</Error> }

            <Repositories>
                {repositories.map(repository => (
                    <Link 
                        to={`repositories/${repository.full_name}`}
                        key={repository.id}
                    >
                    <img 
                        src={repository.owner.avatar_url} 
                        alt={repository.owner.login}
                    />
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                    <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    )
}

export default Dashboard