# AI-Image-Generator
Full-blown NextJS 14 AI Image generator web app with OpenAI API (Dall-E) scaffold using bolt.new
[2024-11-25 00-47-20.webm](https://github.com/user-attachments/assets/e8b44278-0722-49c5-8131-f0e36f29132d)


Fill .env first
```
npm i
npx prisma migrate dev
npm run dev
```

## Feature
- Input prompt text 
- Generate & display AI image 
- Save result generate to gallery 
- Complete and robust error handling 
- Mobile responsive 
- Smooth loading state 
- It can edit/delete from gallery 
- Share feature to social media 
- Rate limiting for API calls

## Stack
- Form handling with React Hook Form and Zod validation
- File storage using Vercel Blob
- Database operation with Prisma and SQLITE3
- HTTP requests managed through Axios
- Cache management & rate limiting with LRU Cache
- Toast notifications via Sonner
- ESLint and Prettier
- Full testing setup with Jest and React Testing Library (TODO)

## Design
- Maintainable
- User Experience
- Performant
- seperate Enviroment vs Production code
- Best practices

- Logging (TODO)
