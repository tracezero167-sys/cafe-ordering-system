// This script updates cafe settings via API
const settings = {
  cafeName: 'be lieve',
  address: '123 Main Street, City'
}

console.log('Please update the cafe name in the admin panel at http://localhost:3000/admin/settings')
console.log('Or manually edit the database using SQLite browser:')
console.log('Database location: prisma/dev.db')
console.log('Table: CafeSettings')
console.log('Update cafeName to: be lieve')
