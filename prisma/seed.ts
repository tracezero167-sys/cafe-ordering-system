import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@cafe.com' },
    update: {},
    create: {
      email: 'admin@cafe.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      isActive: true
    }
  })
  console.log('Created admin user:', admin.email)

  // Create cafe settings
  const settings = await prisma.cafeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      cafeName: 'be lieve',
      address: '123 Main Street, City',
      phone: '+91 9876543210',
      whatsappNumber: '+91 9876543210',
      email: 'info@urbanbean.com',
      taxPercentage: 5,
      serviceCharge: 2,
      currency: '₹',
      openingHours: '9:00 AM - 10:00 PM',
      paymentGateway: 'upi',
      whatsappEnabled: true,
      orderPreparationTime: 15,
      notificationSettings: null
    }
  })
  console.log('Created cafe settings')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Momos' },
      update: {},
      create: {
        name: 'Momos',
        description: 'Steamed and fried dumplings',
        displayOrder: 1,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'French Fries' },
      update: {},
      create: {
        name: 'French Fries',
        description: 'Crispy potato fries with various flavors',
        displayOrder: 2,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Pasta' },
      update: {},
      create: {
        name: 'Pasta',
        description: 'Italian pasta dishes',
        displayOrder: 3,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Pizza' },
      update: {},
      create: {
        name: 'Pizza',
        description: 'Wood-fired pizzas with various toppings',
        displayOrder: 4,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Sweet Corn' },
      update: {},
      create: {
        name: 'Sweet Corn',
        description: 'Sweet corn dishes with various flavors',
        displayOrder: 5,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Burger' },
      update: {},
      create: {
        name: 'Burger',
        description: 'Veggie and cheese burgers',
        displayOrder: 6,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Chow Mein' },
      update: {},
      create: {
        name: 'Chow Mein',
        description: 'Stir-fried noodles and dishes',
        displayOrder: 7,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Sandwich' },
      update: {},
      create: {
        name: 'Sandwich',
        description: 'Grilled and roasted sandwiches',
        displayOrder: 8,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Maggi' },
      update: {},
      create: {
        name: 'Maggi',
        description: 'Instant noodles with various toppings',
        displayOrder: 9,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Coffee' },
      update: {},
      create: {
        name: 'Coffee',
        description: 'Hot and cold coffee drinks',
        displayOrder: 10,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Tea' },
      update: {},
      create: {
        name: 'Tea',
        description: 'Matcha and specialty teas',
        displayOrder: 11,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Chocolate Bowl' },
      update: {},
      create: {
        name: 'Chocolate Bowl',
        description: 'Chocolate bowls with various toppings',
        displayOrder: 12,
        isActive: true
      }
    })
  ])
  console.log('Created categories')

  // Create products for each category
  
  // Momos
  const momos = await Promise.all([
    prisma.product.upsert({
      where: { id: 'momo-1' },
      update: {},
      create: {
        id: 'momo-1',
        name: 'Veg Steam Momo',
        description: 'Steamed vegetable dumplings',
        price: 60,
        categoryId: categories[0].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'momo-2' },
      update: {},
      create: {
        id: 'momo-2',
        name: 'Veg Fry Momo',
        description: 'Fried vegetable dumplings',
        price: 70,
        categoryId: categories[0].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'momo-3' },
      update: {},
      create: {
        id: 'momo-3',
        name: 'Paneer Steam Momo',
        description: 'Steamed paneer dumplings',
        price: 100,
        categoryId: categories[0].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'momo-4' },
      update: {},
      create: {
        id: 'momo-4',
        name: 'Paneer Fry Momo',
        description: 'Fried paneer dumplings',
        price: 110,
        categoryId: categories[0].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 4
      }
    }),
    prisma.product.upsert({
      where: { id: 'momo-5' },
      update: {},
      create: {
        id: 'momo-5',
        name: 'Paneer Kurkure Momo',
        description: 'Crunchy paneer dumplings',
        price: 120,
        categoryId: categories[0].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 5
      }
    }),
    prisma.product.upsert({
      where: { id: 'momo-6' },
      update: {},
      create: {
        id: 'momo-6',
        name: 'Cheese Corn Momos',
        description: 'Cheese and corn dumplings',
        price: 120,
        categoryId: categories[0].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 6
      }
    }),
    prisma.product.upsert({
      where: { id: 'momo-7' },
      update: {},
      create: {
        id: 'momo-7',
        name: 'Kurkure Cheese Corn Momo',
        description: 'Crunchy cheese corn dumplings',
        price: 150,
        categoryId: categories[0].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 7
      }
    }),
    prisma.product.upsert({
      where: { id: 'momo-8' },
      update: {},
      create: {
        id: 'momo-8',
        name: 'Afghani Momo',
        description: 'Creamy Afghani style dumplings',
        price: 160,
        categoryId: categories[0].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 8
      }
    })
  ])
  console.log('Created momos')

  // French Fries
  const frenchFries = await Promise.all([
    prisma.product.upsert({
      where: { id: 'fries-1' },
      update: {},
      create: {
        id: 'fries-1',
        name: 'Plain French Fries',
        description: 'Classic crispy fries',
        price: 79,
        categoryId: categories[1].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 10,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'fries-2' },
      update: {},
      create: {
        id: 'fries-2',
        name: 'Masala French Fries',
        description: 'Spiced Indian style fries',
        price: 99,
        categoryId: categories[1].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 10,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'fries-3' },
      update: {},
      create: {
        id: 'fries-3',
        name: 'Peri Peri French Fries',
        description: 'Spicy peri peri fries',
        price: 119,
        categoryId: categories[1].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 10,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'fries-4' },
      update: {},
      create: {
        id: 'fries-4',
        name: 'Mint Sauce Fries',
        description: 'Fries with mint sauce',
        price: 129,
        categoryId: categories[1].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 10,
        displayOrder: 4
      }
    })
  ])
  console.log('Created french fries')

  // Pasta
  const pasta = await Promise.all([
    prisma.product.upsert({
      where: { id: 'pasta-1' },
      update: {},
      create: {
        id: 'pasta-1',
        name: 'Red Sauce Pasta',
        description: 'Tomato based pasta',
        price: 119,
        categoryId: categories[2].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'pasta-2' },
      update: {},
      create: {
        id: 'pasta-2',
        name: 'White Sauce Pasta',
        description: 'Creamy white pasta',
        price: 139,
        categoryId: categories[2].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 2
      }
    })
  ])
  console.log('Created pasta')

  // Pizza
  const pizza = await Promise.all([
    prisma.product.upsert({
      where: { id: 'pizza-1' },
      update: {},
      create: {
        id: 'pizza-1',
        name: 'Veg Pizza',
        description: 'Classic vegetable pizza',
        price: 119,
        categoryId: categories[3].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 20,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'pizza-2' },
      update: {},
      create: {
        id: 'pizza-2',
        name: 'Sweet Corn Pizza',
        description: 'Sweet corn pizza',
        price: 129,
        categoryId: categories[3].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 20,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'pizza-3' },
      update: {},
      create: {
        id: 'pizza-3',
        name: 'Double Cheese Pizza',
        description: 'Extra cheesy pizza',
        price: 159,
        categoryId: categories[3].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 20,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'pizza-4' },
      update: {},
      create: {
        id: 'pizza-4',
        name: 'Onion Capsicum Pizza',
        description: 'Onion and capsicum pizza',
        price: 149,
        categoryId: categories[3].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 20,
        displayOrder: 4
      }
    }),
    prisma.product.upsert({
      where: { id: 'pizza-5' },
      update: {},
      create: {
        id: 'pizza-5',
        name: 'Tandoori Paneer Pizza',
        description: 'Tandoori paneer pizza',
        price: 169,
        categoryId: categories[3].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 20,
        displayOrder: 5
      }
    })
  ])
  console.log('Created pizza')

  // Sweet Corn
  const sweetCorn = await Promise.all([
    prisma.product.upsert({
      where: { id: 'corn-1' },
      update: {},
      create: {
        id: 'corn-1',
        name: 'Masala Sweet Corn',
        description: 'Spiced sweet corn',
        price: 49,
        categoryId: categories[4].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'corn-2' },
      update: {},
      create: {
        id: 'corn-2',
        name: 'Tandoori Sweet Corn',
        description: 'Tandoori flavored sweet corn',
        price: 49,
        categoryId: categories[4].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'corn-3' },
      update: {},
      create: {
        id: 'corn-3',
        name: 'Cheesy Sweet Corn',
        description: 'Cheese topped sweet corn',
        price: 59,
        categoryId: categories[4].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'corn-4' },
      update: {},
      create: {
        id: 'corn-4',
        name: 'Paneer Sweet Corn',
        description: 'Paneer sweet corn',
        price: 59,
        categoryId: categories[4].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 4
      }
    })
  ])
  console.log('Created sweet corn')

  // Burger
  const burger = await Promise.all([
    prisma.product.upsert({
      where: { id: 'burger-1' },
      update: {},
      create: {
        id: 'burger-1',
        name: 'Potato Tikki',
        description: 'Potato patty burger',
        price: 79,
        categoryId: categories[5].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 12,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'burger-2' },
      update: {},
      create: {
        id: 'burger-2',
        name: 'Cheese Tikki',
        description: 'Cheese potato patty burger',
        price: 99,
        categoryId: categories[5].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 12,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'burger-3' },
      update: {},
      create: {
        id: 'burger-3',
        name: 'Double Tikki',
        description: 'Double potato patty burger',
        price: 99,
        categoryId: categories[5].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 12,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'burger-4' },
      update: {},
      create: {
        id: 'burger-4',
        name: 'Double Tikki Cheese Burger',
        description: 'Double potato patty with cheese',
        price: 119,
        categoryId: categories[5].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 12,
        displayOrder: 4
      }
    })
  ])
  console.log('Created burgers')

  // Chow Mein
  const chowMein = await Promise.all([
    prisma.product.upsert({
      where: { id: 'noodle-1' },
      update: {},
      create: {
        id: 'noodle-1',
        name: 'Veg Chow Mein',
        description: 'Stir-fried vegetable noodles',
        price: 99,
        categoryId: categories[6].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'noodle-2' },
      update: {},
      create: {
        id: 'noodle-2',
        name: 'Hakka Noodles',
        description: 'Hakka style noodles',
        price: 99,
        categoryId: categories[6].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'noodle-3' },
      update: {},
      create: {
        id: 'noodle-3',
        name: 'Paneer Chow Mein',
        description: 'Paneer noodles',
        price: 129,
        categoryId: categories[6].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'noodle-4' },
      update: {},
      create: {
        id: 'noodle-4',
        name: 'Veg Thupka',
        description: 'Soup and noodles combo',
        price: 149,
        categoryId: categories[6].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 15,
        displayOrder: 4
      }
    })
  ])
  console.log('Created chow mein')

  // Sandwich
  const sandwich = await Promise.all([
    prisma.product.upsert({
      where: { id: 'sandwich-1' },
      update: {},
      create: {
        id: 'sandwich-1',
        name: 'Plain Cheese Sandwich',
        description: 'Simple cheese sandwich',
        price: 59,
        categoryId: categories[7].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'sandwich-2' },
      update: {},
      create: {
        id: 'sandwich-2',
        name: 'Veg Sandwich',
        description: 'Vegetable sandwich',
        price: 79,
        categoryId: categories[7].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'sandwich-3' },
      update: {},
      create: {
        id: 'sandwich-3',
        name: 'Sweet Corn Sandwich',
        description: 'Sweet corn sandwich',
        price: 89,
        categoryId: categories[7].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'sandwich-4' },
      update: {},
      create: {
        id: 'sandwich-4',
        name: 'Paneer Sweet Corn Sandwich',
        description: 'Paneer sweet corn sandwich',
        price: 119,
        categoryId: categories[7].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 4
      }
    }),
    prisma.product.upsert({
      where: { id: 'sandwich-5' },
      update: {},
      create: {
        id: 'sandwich-5',
        name: 'Cheese Roasted Sandwich',
        description: 'Grilled cheese sandwich',
        price: 89,
        categoryId: categories[7].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 5
      }
    }),
    prisma.product.upsert({
      where: { id: 'sandwich-6' },
      update: {},
      create: {
        id: 'sandwich-6',
        name: 'Double Cheese Roasted Sandwich',
        description: 'Double cheese grilled sandwich',
        price: 99,
        categoryId: categories[7].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 8,
        displayOrder: 6
      }
    })
  ])
  console.log('Created sandwiches')

  // Maggi
  const maggi = await Promise.all([
    prisma.product.upsert({
      where: { id: 'maggi-1' },
      update: {},
      create: {
        id: 'maggi-1',
        name: 'Plain Maggi',
        description: 'Classic instant noodles',
        price: 49,
        categoryId: categories[8].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'maggi-2' },
      update: {},
      create: {
        id: 'maggi-2',
        name: 'Plain Cheese Maggi',
        description: 'Cheese instant noodles',
        price: 59,
        categoryId: categories[8].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'maggi-3' },
      update: {},
      create: {
        id: 'maggi-3',
        name: 'Veg Maggi',
        description: 'Vegetable instant noodles',
        price: 59,
        categoryId: categories[8].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'maggi-4' },
      update: {},
      create: {
        id: 'maggi-4',
        name: 'Veg Cheese Maggi',
        description: 'Vegetable cheese noodles',
        price: 79,
        categoryId: categories[8].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 4
      }
    })
  ])
  console.log('Created maggi')

  // Coffee
  const coffee = await Promise.all([
    prisma.product.upsert({
      where: { id: 'coffee-1' },
      update: {},
      create: {
        id: 'coffee-1',
        name: 'Cold Coffee',
        description: 'Chilled coffee drink',
        price: 80,
        categoryId: categories[9].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'coffee-2' },
      update: {},
      create: {
        id: 'coffee-2',
        name: 'Chocolate Cold Coffee',
        description: 'Chocolate flavored cold coffee',
        price: 100,
        categoryId: categories[9].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'coffee-3' },
      update: {},
      create: {
        id: 'coffee-3',
        name: 'KitKat Cold Coffee',
        description: 'KitKat cold coffee',
        price: 120,
        categoryId: categories[9].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'coffee-4' },
      update: {},
      create: {
        id: 'coffee-4',
        name: 'Oreo Cold Coffee',
        description: 'Oreo cold coffee',
        price: 120,
        categoryId: categories[9].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 4
      }
    })
  ])
  console.log('Created coffee')

  // Tea
  const tea = await Promise.all([
    prisma.product.upsert({
      where: { id: 'tea-1' },
      update: {},
      create: {
        id: 'tea-1',
        name: 'Green Matcha Tea',
        description: 'Green matcha tea',
        price: 80,
        categoryId: categories[10].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'tea-2' },
      update: {},
      create: {
        id: 'tea-2',
        name: 'Strawberry Matcha Tea',
        description: 'Strawberry matcha tea',
        price: 100,
        categoryId: categories[10].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'tea-3' },
      update: {},
      create: {
        id: 'tea-3',
        name: 'Mango Matcha Tea',
        description: 'Mango matcha tea',
        price: 100,
        categoryId: categories[10].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'tea-4' },
      update: {},
      create: {
        id: 'tea-4',
        name: 'Pineapple Matcha Tea',
        description: 'Pineapple matcha tea',
        price: 100,
        categoryId: categories[10].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 5,
        displayOrder: 4
      }
    })
  ])
  console.log('Created tea')

  // Chocolate Bowl
  const chocolateBowl = await Promise.all([
    prisma.product.upsert({
      where: { id: 'choco-1' },
      update: {},
      create: {
        id: 'choco-1',
        name: 'KitKat Bowl',
        description: 'KitKat chocolate bowl',
        price: 150,
        categoryId: categories[11].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 10,
        displayOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'choco-2' },
      update: {},
      create: {
        id: 'choco-2',
        name: 'Oreo Bowl',
        description: 'Oreo chocolate bowl',
        price: 150,
        categoryId: categories[11].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 10,
        displayOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'choco-3' },
      update: {},
      create: {
        id: 'choco-3',
        name: 'Chocolate Loaded Bowl',
        description: 'Loaded chocolate bowl',
        price: 180,
        categoryId: categories[11].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 10,
        displayOrder: 3
      }
    }),
    prisma.product.upsert({
      where: { id: 'choco-4' },
      update: {},
      create: {
        id: 'choco-4',
        name: 'Strawberry Chocolate Bowl',
        description: 'Strawberry chocolate bowl',
        price: 180,
        categoryId: categories[11].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 10,
        displayOrder: 4
      }
    }),
    prisma.product.upsert({
      where: { id: 'choco-5' },
      update: {},
      create: {
        id: 'choco-5',
        name: 'Red Velvet Bowl',
        description: 'Red velvet chocolate bowl',
        price: 180,
        categoryId: categories[11].id,
        foodType: 'VEG',
        availability: true,
        preparationTime: 10,
        displayOrder: 5
      }
    })
  ])
  console.log('Created chocolate bowls')

  // Create tables
  const tables = await Promise.all([
    prisma.table.upsert({
      where: { tableNumber: 'T1' },
      update: {},
      create: {
        tableNumber: 'T1',
        name: 'Table 1',
        capacity: 4,
        status: 'AVAILABLE',
        isActive: true
      }
    }),
    prisma.table.upsert({
      where: { tableNumber: 'T2' },
      update: {},
      create: {
        tableNumber: 'T2',
        name: 'Table 2',
        capacity: 4,
        status: 'AVAILABLE',
        isActive: true
      }
    }),
    prisma.table.upsert({
      where: { tableNumber: 'T3' },
      update: {},
      create: {
        tableNumber: 'T3',
        name: 'Table 3',
        capacity: 6,
        status: 'AVAILABLE',
        isActive: true
      }
    }),
    prisma.table.upsert({
      where: { tableNumber: 'T4' },
      update: {},
      create: {
        tableNumber: 'T4',
        name: 'Table 4',
        capacity: 2,
        status: 'AVAILABLE',
        isActive: true
      }
    }),
    prisma.table.upsert({
      where: { tableNumber: 'T5' },
      update: {},
      create: {
        tableNumber: 'T5',
        name: 'Table 5',
        capacity: 8,
        status: 'AVAILABLE',
        isActive: true
      }
    })
  ])
  console.log('Created tables')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
