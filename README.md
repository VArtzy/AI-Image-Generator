# AI-Image-Generator
Full-blown NextJS 14 AI Image generator web app with OpenAI API (Dall-E) scaffold using bolt.new
[AI Image Generator Demo](https://github.com/VArtzy/HostImage/raw/refs/heads/main/2024-11-25%2000-47-20.mp4)

Fill .env first
```
npm i
npx prisma migrate dev
npm run dev
```

Alternatively, if you are ready using your consume openai token:

```
npm run build
npm run start
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
- HTTP requests managed through fetch
- Cache management & rate limiting with LRU Cache
- Toast notifications via Sonner
- ESLint and Prettier
- Full testing setup with Jest and React Testing Library (TODO)

## Design
- Maintainable
- User Experience
- Performant
- Documented API Specs & Integration Test via .http file
- seperate Enviroment vs Production code (mocking!)
- Best practices

- Logging (TODO)
