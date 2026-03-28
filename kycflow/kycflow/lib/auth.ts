import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const email = credentials.email as string
          const password = credentials.password as string

          console.log("Trying to find business with email:", email)

          const business = await prisma.business.findUnique({
            where: { email },
          })

          console.log("Found business:", business ? "yes" : "no")

          if (!business) {
            return null
          }

          const passwordMatch = await bcrypt.compare(
            password,
            business.password
          )

          console.log("Password match:", passwordMatch)

          if (!passwordMatch) {
            return null
          }

          return {
            id: business.id,
            email: business.email,
            name: business.name,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
})