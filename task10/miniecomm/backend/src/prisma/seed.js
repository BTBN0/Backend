import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed эхэллээ...");

  await prisma.user.upsert({
    where:  { email: "admin@shop.mn" },
    update: {},
    create: {
      name:     "Admin",
      email:    "admin@shop.mn",
      password: await bcrypt.hash("password123", 10),
      role:     "admin",
    },
  });

  await prisma.user.upsert({
    where:  { email: "user@shop.mn" },
    update: {},
    create: {
      name:     "Bat-Erdene",
      email:    "user@shop.mn",
      password: await bcrypt.hash("password123", 10),
      role:     "user",
    },
  });

  const products = [
    { name: "Утасны Дугтуй",    description: "Монгол угалзаар чимэглэсэн арьсан дугтуй.",     price: 45000,  imageUrl: "https://images.unsplash.com/photo-1601593346740-925612772716?w=400", category: "Хэрэглэл" },
    { name: "Ноолуурын Малгай", description: "100% монгол ноолуураар хийсэн малгай.",          price: 89000,  imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400", category: "Хувцас"   },
    { name: "Гар Хийцийн Аяга", description: "Уламжлалт арга технологиор хийсэн шаазан аяга.", price: 32000,  imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400", category: "Гэр"      },
    { name: "Модон Тавиур",     description: "Байгалийн хуш модоор хийсэн тавиур.",            price: 125000, imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", category: "Гэр"      },
    { name: "Арьсан Цүнх",     description: "Үхрийн арьсаар хийсэн том цүнх.",                price: 210000, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", category: "Хэрэглэл" },
    { name: "Ноолуурын Бээлий", description: "Нарийн ноолуураар нэхсэн дулаахан бээлий.",     price: 65000,  imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400", category: "Хувцас"   },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log("✅ Seed дууслаа!");
  console.log("   admin@shop.mn / password123  →  admin");
  console.log("   user@shop.mn  / password123  →  user");
  console.log(`   📦 ${products.length} бүтээгдэхүүн нэмэгдлээ`);
}

main()
  .catch(e => { console.error("❌", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
