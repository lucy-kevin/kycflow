import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { faker } from "@faker-js/faker"
import bcrypt from "bcryptjs"
import { config } from "dotenv"

config({ path: ".env" })

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  const hashedPassword = await bcrypt.hash("password123", 10)

  const business = await prisma.business.upsert({
    where: { email: "demo@kycflow.com" },
    update: {},
    create: {
      name: "Demo Business",
      email: "demo@kycflow.com",
      password: hashedPassword,
    },
  })

  console.log("Created business:", business.email)

  const idTypes = ["National ID", "Passport", "Driving Licence"]

  for (let i = 0; i < 50; i++) {
    const score = faker.number.int({ min: 0, max: 100 })

    const status =
      score >= 85
        ? "approved"
        : score >= 60
        ? "manual_review"
        : "rejected"

    await prisma.verification.create({
      data: {
        businessId: business.id,
        customerName: faker.person.fullName(),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        nationality: faker.location.country(),
        email: faker.internet.email(),
        idType: faker.helpers.arrayElement(idTypes),
        documentUrl: faker.image.url(),
        status,
        confidenceScore: score,
        checkResults: {
          name_valid: true,
          age_eligible: true,
          document_type_valid: true,
          face_detected: score > 30,
          confidence_score: score,
        },
      },
    })
  }

  console.log("Created 50 verifications")
  console.log("Done! Login with demo@kycflow.com / password123")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())