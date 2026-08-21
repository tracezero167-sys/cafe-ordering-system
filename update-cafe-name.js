const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateCafeName() {
  try {
    const settings = await prisma.cafeSettings.findFirst()
    if (settings) {
      await prisma.cafeSettings.update({
        where: { id: settings.id },
        data: { cafeName: 'be lieve' }
      })
      console.log('Cafe name updated successfully to "be lieve"')
    } else {
      await prisma.cafeSettings.create({
        data: { cafeName: 'be lieve' }
      })
      console.log('Cafe settings created with name "be lieve"')
    }
  } catch (error) {
    console.error('Error updating cafe name:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCafeName()
