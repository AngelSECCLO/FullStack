import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('blog shows only title and author in small div', () => {
  const blog = {
    title: 'Testing title',
    author: 'Testing author',
    url: 'Testing url',
    likes: 15,
    user: { id: 'testinguserid', user: 'user', username: 'username' }
  }

  const component = render(
    <Blog blog={blog} />
  )

  const shortdiv = component.container.querySelector('.blogshortdiv')
  const longdiv = component.container.querySelector('.bloglongdiv')
  expect(shortdiv).not.toHaveStyle('display: none')
  expect(longdiv).toHaveStyle('display: none')
})

test('clicking the "view" button shows the additional info', () => {
  const blog = {
    title: 'Testing title',
    author: 'Testing author',
    url: 'Testing url',
    likes: 15,
    user: { id: 'testinguserid', user: 'user', username: 'username' }
  }

  const component = render(
    <Blog blog={blog} />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  const shortdiv = component.container.querySelector('.blogshortdiv')
  const longdiv = component.container.querySelector('.bloglongdiv')
  expect(shortdiv).toHaveStyle('display: none')
  expect(longdiv).not.toHaveStyle('display: none')
})

test('clicking the "like" button twice calls the handler twice', () => {
  const blog = {
    title: 'Testing title',
    author: 'Testing author',
    url: 'Testing url',
    likes: 15,
    user: { id: 'testinguserid', user: 'user', username: 'username' }
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} increaseLikes={mockHandler} />
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)
  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})