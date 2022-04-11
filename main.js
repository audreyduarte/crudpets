'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_pet')) ?? []
const setLocalStorage = (dbPet) => localStorage.setItem('db_pet', JSON.stringify(dbPet))


const deletePet = (index) => {
    const dbPet = readPets()
    dbPet.splice(index, 1)
    setLocalStorage(dbPet)
}

const updatePet = (index, pet) => {
    const dbPet = readPets()
    dbPet[index] = pet
    setLocalStorage(dbPet)
}

const readPets = () => getLocalStorage()

const createPet = (pet) => {
    const dbPet = getLocalStorage()
    dbPet.push(pet)
    setLocalStorage(dbPet)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = null)
    document.getElementById('nome').dataset.index = "new"
}

const savePet = () => {
    if (isValidFields()) {
        const pet = {
            nome: document.getElementById('nome').value,
            espécie: document.getElementById('espécie').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            tutor: document.getElementById('tutor').value
        }

        const index = document.getElementById("nome").dataset.index
        if (index == 'new') {
            createPet(pet)
            updateTable()
            closeModal()
        } else {
            updatePet(index, pet)
            updateTable()
            closeModal()
        }
    }
}
        
const createRow = (pet, index) => {
            const newRow = document.createElement('tr')
            newRow.innerHTML = `
    <td>${pet.nome}</td>
    <td>${pet.espécie}</td>
    <td>${pet.dataNascimento}</td>
    <td>${pet.tutor}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
`

        document.querySelector('#tabelaPet>tbody').appendChild(newRow)
        }

        const clearTable = () => {
            const rows = document.querySelectorAll('#tabelaPet>tbody>tr')
            rows.forEach(row => row.parentNode.removeChild(row))
        }

        const updateTable = () => {
            const dbPet = readPets()
            clearTable()
            dbPet.forEach(createRow)
        }

        const fillFields = (pet) => {
            document.getElementById('nome').value = pet.nome
            document.getElementById('espécie').value = pet.espécie
            document.getElementById('dataNascimento').value = pet.dataNascimento
            document.getElementById('tutor').value = pet.tutor
            document.getElementById('nome').dataset.index = pet.index
        }

        const editPet = (index) => {
            const pet = readPets()[index]
            pet.index = index
            fillFields(pet)
            openModal()
        }

        const editDelete = (event) => {
            if (event.target.type == 'button') {

                const [action, index] = event.target.id.split('-')

                if (action == 'edit') {
                    editPet(index)
                } else {
                    const pet = readPets()[index]
                    const response = confirm(`Deseja excluir o pet ${pet.nome}?`)
                    if (response) {
                        deletePet(index)
                        updateTable()
                    }

                }
            }
        }

updateTable()
        //eventos
        document.getElementById('cadastrarPet')
            .addEventListener('click', openModal)

        document.getElementById('modalClose')
            .addEventListener('click', closeModal)

        document.getElementById('salvar')
            .addEventListener('click', savePet)
            
        document.getElementById('cancelar')
            .addEventListener('click', closeModal)

        document.querySelector('#tabelaPet>tbody')
            .addEventListener('click', editDelete)
    