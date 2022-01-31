const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let sum = 0
    for (let i = 0; i < blogs.length; i++) {
        return sum += blogs[i].likes
    }
}

const favoriteBlog = (blogs) => {
    let favorite = blogs[0].likes
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > favorite) {
            favorite = blogs[i].likes
        }
    }
    return favorite
}

const mostBlogs = (blogs) => {
    let result = {}

    for (let blog of blogs) {
        if (!result[blog.author]) {
            result[blog.author] = 1
        } else {
            result[blog.author] += 1
        }
    }
    // result ={"Michael Chan":1,"Edsger W. Dijkstra":2,"Robert C. Martin":3} 

    let mostBlogsAuthor = { author: '', blogs: 0 }

    for (let author in result) {
        if (result[author] > mostBlogsAuthor.blogs) {
            mostBlogsAuthor.author = author
            mostBlogsAuthor.blogs = result[author]
        }
    }
    return mostBlogsAuthor
}

const mostLikes = (blogs) => {
    let result = {}

    for (let blog of blogs) {
        if (!result[blog.author]) {
            result[blog.author] = blog.likes
        } else {
            result[blog.author] += blog.likes
        }
    }
    // {"Michael Chan":7,"Edsger W. Dijkstra":17,"Robert C. Martin":12}  
    console.log(result)
    let mostBlogsAuthor = { author: '', likes: 0 }

    for (let author in result) {
        if (result[author] > mostBlogsAuthor.likes) {
            mostBlogsAuthor.author = author
            mostBlogsAuthor.likes = result[author]
        }
    }
    return mostBlogsAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}