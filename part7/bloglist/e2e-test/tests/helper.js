const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(blog.title)
  await page.getByLabel('author').fill(blog.author)
  await page.getByLabel('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()

  await page.getByRole('link', { name: `${blog.title} ${blog.author}` }).waitFor()
}

const openBlog = async (page, blog) => {
  await page.getByRole('link', { name: `${blog.title} ${blog.author}` }).click()
}

export { loginWith, createBlog, openBlog }
