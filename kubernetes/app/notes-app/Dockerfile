# ----------------------------------- BASE ----------------------------------- #
FROM node:20 AS base
# ENV DATABASE_URL="postgresql://postgres:password@postgres:5432/notesdb?schema=notes_schema"

# ----------------------------------- DEPS ----------------------------------- #
FROM base AS deps
WORKDIR /app

COPY package.json ./

RUN npm update && npm install

# ---------------------------------- BUILDER --------------------------------- #
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY prisma ./prisma
COPY src ./src
COPY \
    package.json \
    next.config.mjs \
    tsconfig.json \
    tailwind.config.ts \
    postcss.config.mjs \
    .eslintrc.json \
    ./

ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npx next build
# ---------------------------------- RUNNER ---------------------------------- #


FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
#creates a system group named nodejs 
RUN addgroup --system --gid 1001 nodejs

#creates a system group named nextjs 
RUN adduser --system --uid 1001 nextjs


#copy the file from to public folder 
# COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
# if in your application 3000 will not run, then change the expose port
# ex: EXPOSE <port>
EXPOSE 3000

# set Environment port
ENV PORT 3000


CMD HOSTNAME="0.0.0.0" node server.js
