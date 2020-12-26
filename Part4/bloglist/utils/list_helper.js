const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item['likes']
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (cur, item) => {
    if (cur['likes'] < item['likes']) {
      return item
    } else {
      return cur
    }
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else if (blogs.length === 1) {
    return { author: blogs[0]['author'], blogs: 1 }
  }
  const authors = {}
  blogs.forEach(function (item) {
    if (!(item['author'] in authors)) {
      authors[item['author']] = 0
    }
    authors[item['author']] += 1
  })

  const maxAuthor = { author: 0, blogs: 0 }
  Object.keys(authors).forEach(function (item) {
    if (authors[item] > maxAuthor['blogs']) {
      maxAuthor['author'] = item
      maxAuthor['blogs'] = authors[item]
    }
  })
  return maxAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else if (blogs.length === 1) {
    return { author: blogs[0]['author'], likes: blogs[0]['likes'] }
  }
  const authors = {}
  blogs.forEach(function (item) {
    if (!(item['author'] in authors)) {
      authors[item['author']] = 0
    }
    authors[item['author']] += item['likes']
  })

  const maxAuthor = { author: 0, likes: 0 }
  Object.keys(authors).forEach(function (item) {
    if (authors[item] > maxAuthor['likes']) {
      maxAuthor['author'] = item
      maxAuthor['likes'] = authors[item]
    }
  })
  return maxAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}