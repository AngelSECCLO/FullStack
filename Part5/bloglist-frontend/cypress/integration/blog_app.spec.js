import { func } from "prop-types"

describe('Blog app', function() {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.createUser( {name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' })
        cy.createUser( {name: 'Random user', username: 'random', password: 'randompass' })
    })

    it('Login form is shown', function() {
        cy.contains('login')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()

            cy.contains('Matti Luukkainen logged-in')
        })

        it('fails with wrong credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('blah')
            cy.get('#login-button').click()

            cy.get('.error')
              .should('contain', 'Wrong credentials!')
              .and('have.css', 'color', 'rgb(255, 0, 0)')
              .and('have.css', 'border-style', 'solid')
            cy.get('html').should('not.contain', 'Matti Luukkainen logged-in')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'mluukkai', password: 'salainen' })
        })

        it('A blog can be created', function() {
            cy.contains('new blog').click()
            cy.get('#title').type('A blog created by cypress')
            cy.get('#author').type('Someone famous')
            cy.get('#url').type('http://something.com')
            cy.get('#create-button').click()

            cy.contains('A blog created by cypress')
        })

        describe('and a blog exists', function() {
            beforeEach(function () {
                cy.createBlog({ title: 'first blog', author: 'Someone famous', url: 'not important' })
                cy.createBlog({ title: 'second blog', author: 'Someone famous', url: 'not important' })
                cy.createBlog({ title: 'third blog', author: 'Someone not so famous', url: 'not important' })
            })
    
            it('a user can like a blog', function() {
                cy.contains('second blog').contains('view').click()
                cy.contains('second blog').parent().find('.bloglongdiv').should('contain', 'likes 0')
                cy.contains('second blog').parent().find('.bloglongdiv').find('#like-button').click()
                cy.contains('second blog').parent().find('.bloglongdiv').should('contain', 'likes 1')
            })

            it('a user can delete their own blog', function() {
                cy.contains('third blog').contains('view').click()
                cy.contains('third blog').parent().find('.bloglongdiv').find('#remove-button').click()
                cy.contains('first blog').parent().parent().should('contain', 'second blog')
                    .and('contain', 'first blog')                
                    .and('not.contain', 'third blog')
            })

            it('a user cannot delete blogs from other users', function() {
                cy.login({ username: 'random', password: 'randompass'})
                cy.contains('third blog').contains('view').click()
                cy.contains('third blog').parent().find('.bloglongdiv').should('not.contain', 'remove')
            })

            it('blogs are ordered according to likes', function() {
                cy.contains('first blog').contains('view').click()
                cy.contains('second blog').contains('view').click()
                cy.contains('third blog').contains('view').click()
                cy.contains('second blog').parent().find('.bloglongdiv').find('#like-button').click()
                cy.contains('second blog').parent().find('.bloglongdiv').find('#like-button').click()
                cy.contains('second blog').parent().find('.bloglongdiv').find('#like-button').click()
                cy.contains('third blog').parent().find('.bloglongdiv').find('#like-button').click()
                cy.contains('third blog').parent().find('.bloglongdiv').find('#like-button').click()
                cy.contains('first blog').parent().find('.bloglongdiv').find('#like-button').click()
                cy.get('html').find('.bloglongdiv:first').should('contain', 'second blog')
                cy.get('html').find('.bloglongdiv:last').should('contain', 'first blog')
            })
        })
    })
})