const express = require('express');
const cors = require('cors');
const app = express();
const port = 3050;



app.use(cors());

app.options('*', cors()); 

// Define a simple GET route
app.get('/departments', (req, res) => {
  res.json({ departments: [
    { 
        "id": 1, 
        "category": "Management", 
        "name": "Engineering Office", 
        "manager": "Hamid Abdelhamid", 
        "description": "Manages all of the production processes such as cutting, tailoring, and printing."
    },
    { 
        "id": 2, 
        "category": "Management", 
        "name": "Finance Office", 
        "manager": "Sam Kfouri", 
        "description": "Dealing with all the financial matters of the factory."
    },
    { 
        "id": 3, 
        "category": "Production", 
        "name": "Cutting Division I", 
        "manager": "Omar Akil", 
        "description": "Handles the basic cutting process."
    },
    { 
        "id": 4, 
        "category": "Production", 
        "name": "Cutting Division II", 
        "manager": "Mohammed Atouani", 
        "description": "Handles the advanced cutting process for the tailoring division."
    },
    { 
        "id": 5, 
        "category": "Production", 
        "name": "Tailoring Division", 
        "manager": "Mouad Moutaouakil", 
        "description": "Tailors the textile layers cut in the previous cutting division."
    },
    { 
        "id": 6, 
        "category": "Production", 
        "name": "Printing", 
        "manager": "Chris Tucker", 
        "description": "Prints the tailored clothes accroding to the given instructions."
    }
] });
});

// route for users
app.get('/users', (req, res) => {
    res.json({ users: [
      { 
          "id": 1, 
          "category": "Management", 
          "office": "Engineering Office", 
          "name": "Hamid Abdelhamid"
      },
      { 
          "id": 2, 
          "category": "Management", 
          "office": "Finance Office", 
          "name": "Sam Kfouri"
      },
      { 
          "id": 3, 
          "category": "Production", 
          "office": "Cutting Division I", 
          "name": "Omar Akil"
      },
      { 
          "id": 4, 
          "category": "Production", 
          "office": "Cutting Division II", 
          "name": "Mohammed Atouani"
      },
      { 
          "id": 5, 
          "category": "Production", 
          "office": "Tailoring Division", 
          "name": "Mouad Moutaouakil"
      },
      { 
          "id": 6, 
          "category": "Production", 
          "office": "Printing", 
          "name": "Chris Tucker"
      }
  ] });
});

// route for warehouses
app.get('/warehouses', (req, res) => {
    res.json({ warehouses: [
      { 
          "id": 1, 
          "location": "Acharfiah II", 
          "manager": "Khalid Mouataz", 
          "name": "Factory I",
          "capacity": 34
      },
      { 
          "id": 2, 
          "location": "Acharfiah I", 
          "manager": "Zakaria Grace", 
          "name": "Factory II",
          "capacity": 34
      },
      { 
          "id": 3, 
          "location": "Khalifa St 21", 
          "manager": "Lambert Grane", 
          "name": "Factory III",
          "capacity": 34
      },
      { 
          "id": 4, 
          "location": "Tarkelah", 
          "manager": "Narin Chahin", 
          "name": "Factory IV",
          "capacity": 34
      },
      { 
          "id": 5, 
          "location": "Al Madena I", 
          "manager": "Hanger Groove", 
          "name": "Factory V",
          "capacity": 34
      },
      { 
          "id": 6, 
          "location": "Al Madena II", 
          "manager": "Ali Khalife", 
          "name": "Factory VI",
          "capacity": 34
      }
  ] });
});


// route for suppliers
app.get('/suppliers', (req, res) => {
    res.json({ suppliers: [
        {
            id: 1,
            name: "Aleppo Textiles Ltd.",
            contactInfo: {
                phone: "+963 1234 567",
                email: "contact@aleppotextiles.sy"
            },
            address: "123 Industrial Zone, Aleppo, Syria"
        },
        {
            id: 2,
            name: "Damascus Fabrics Co.",
            contactInfo: {
                phone: "+963 9876 543",
                email: "info@damascusfabrics.sy"
            },
            address: "456 Business District, Damascus, Syria"
        },
        {
            id: 3,
            name: "Latakia Weaving Works",
            contactInfo: {
                phone: "+963 3456 789",
                email: "sales@latakia-weaving.sy"
            },
            address: "789 Seaside Avenue, Latakia, Syria"
        },
        {
            id: 4,
            name: "Homs Cotton Suppliers",
            contactInfo: {
                phone: "+963 2345 678",
                email: "support@homscotton.sy"
            },
            address: "321 Cotton Drive, Homs, Syria"
        },
        {
            id: 5,
            name: "Tartous Textile Solutions",
            contactInfo: {
                phone: "+963 5432 109",
                email: "inquiries@tartoustextile.sy"
            },
            address: "654 Harbor Road, Tartous, Syria"
        },
        {
            id: 6,
            name: "Raqqa Garment Makers",
            contactInfo: {
                phone: "+963 6789 012",
                email: "contact@raqqagarments.sy"
            },
            address: "987 Fabric Lane, Raqqa, Syria"
        },
        {
            id: 7,
            name: "Deir Ezzor Cloth Co.",
            contactInfo: {
                phone: "+963 7890 345",
                email: "info@deirezzorcloth.sy"
            },
            address: "210 Textile Avenue, Deir Ezzor, Syria"
        }
    ] });
});

// materials
app.get('/materials', (req, res) => {
    res.json({ materials: [
        {
            id: 1,
            name: "Cotton Fabric",
            type: "Natural Fiber",
            color: "White",
            description: "Soft, breathable, and durable fabric commonly used for shirts and pants.",
            supplier: "Aleppo Textiles Ltd."
        },
        {
            id: 2,
            name: "Silk Fabric",
            type: "Natural Fiber",
            color: "Green",
            description: "Luxurious and smooth fabric with a shiny appearance, perfect for formal wear.",
            supplier: "Damascus Fabrics Co."
        },
        {
            id: 3,
            name: "Wool Fabric",
            type: "Natural Fiber",
            color: "Beige",
            description: "Warm and cozy fabric, ideal for winter clothing and outerwear.",
            supplier: "Latakia Weaving Works"
        },
        {
            id: 4,
            name: "Polyester Fabric",
            type: "Synthetic Fiber",
            color: "Cyan",
            description: "Strong and durable fabric, resistant to shrinking and stretching.",
            supplier: "Homs Cotton Suppliers"
        },
        {
            id: 5,
            name: "Nylon Fabric",
            type: "Synthetic Fiber",
            color: "Blue",
            description: "Elastic and strong fabric, great for activewear and swimwear.",
            supplier: "Tartous Textile Solutions"
        },
        {
            id: 6,
            name: "Denim Fabric",
            type: "Cotton",
            color: "Yellow",
            description: "Rugged and sturdy fabric primarily used for making jeans and jackets.",
            supplier: "Raqqa Garment Makers"
        },
        {
            id: 7,
            name: "Linen Fabric",
            type: "Natural Fiber",
            color: "Brown",
            description: "Light and airy fabric, ideal for summer clothing due to its cooling properties.",
            supplier: "Deir Ezzor Cloth Co."
        }
    ] });
});

// material-categories
app.get('/material-categories', (req, res) => {
    res.json({ materialCategories: [
        {
            name: 'Cotton',
            description: 'Cotton is a soft, fluffy staple fiber that grows in a boll, or protective case.'
        },
        {
            name: 'Wool',
            description: 'Wool is the textile fiber obtained from sheep and other animals.'
        },
        {
            name: 'Silk',
            description: 'Silk is a natural protein fiber, some forms of which can be woven into textiles.'
        },
        {
            name: 'Polyester',
            description: 'Polyester is a category of polymers that contain the ester functional group.'
        },
        {
            name: 'Leather',
            description: 'Leather is a durable and flexible material created by tanning animal rawhide and skins.'
        },
        {
            name: 'Denim',
            description: 'Denim is a sturdy cotton warp-faced textile in which the weft passes under two.'
        },
        {
            name: 'Linen',
            description: 'Linen is a textile made from the fibers of the flax plant. Linen is labor-intensive.'
        }
    ] });
});

// internal Orders
app.get('/internal-orders', (req, res) => {
    res.json({ internalOrders: [
        {
          expectedDelivery: '2024-02-10',
          priority: 'HIGH',
          status: 'PENDING',
          material: 'Wool',
          quantity: 100,
          specifics: 'Warm and soft',
          notes: 'Urgent delivery required'
        },
        {
          expectedDelivery: '2024-03-15',
          priority: 'MEDIUM',
          status: 'APPROVED',
          material: 'Cotton',
          quantity: 200,
          specifics: 'Lightweight cotton',
          notes: 'Check for quality'
        },
        {
          expectedDelivery: '2024-04-20',
          priority: 'LOW',
          status: 'REJECTED',
          material: 'Silk',
          quantity: 50,
          specifics: 'Premium silk',
          notes: 'Order was rejected due to price'
        },
        {
          expectedDelivery: '2024-05-25',
          priority: 'HIGH',
          status: 'FULFILLED',
          material: 'Denim',
          quantity: 150,
          specifics: 'Heavy-duty denim',
          notes: 'Ensure proper packaging'
        },
        {
          expectedDelivery: '2024-06-30',
          priority: 'MEDIUM',
          status: 'CANCELLED',
          material: 'Linen',
          quantity: 70,
          specifics: 'Natural linen',
          notes: 'Order cancelled by the client'
        },
        {
          expectedDelivery: '2024-07-12',
          priority: 'LOW',
          status: 'COMPLETED',
          material: 'Polyester',
          quantity: 120,
          specifics: 'Resistant polyester',
          notes: 'Delivered on time'
        },
        {
          expectedDelivery: '2024-08-18',
          priority: 'HIGH',
          status: 'ONGOING',
          material: 'Leather',
          quantity: 80,
          specifics: 'Genuine leather',
          notes: 'Custom order'
        },
        {
          expectedDelivery: '2024-09-22',
          priority: 'MEDIUM',
          status: 'PENDING',
          material: 'Suede',
          quantity: 60,
          specifics: 'Soft suede',
          notes: 'For autumn collection'
        }
      ] });
});


// internal materialMovements
app.get('/material-movements', (req, res) => {
    res.json({ materialMovements: [
        {
            materialName: 'Cotton Fabric',
            from: 'Supplier',
            to: 'Warehouse',
            movementType: 'INCOMING',
            quantity: 100,
            unitOfMeasure: 'meters',
            status: 'Approved',
            notes: 'Deliver to Warehouse 5'
        },
        {
            materialName: 'Polyester Yarn',
            from: 'Department A',
            to: 'Department B',
            movementType: 'TRANSFER',
            quantity: 450,
            unitOfMeasure: 'kilograms',
            status: 'Ongoing',
            notes: 'Urgent for production'
        },
        {
            materialName: 'Woolen Thread',
            from: 'Warehouse',
            to: 'Department C',
            movementType: 'OUTGOING',
            quantity: 75,
            unitOfMeasure: 'spools',
            status: 'Pending',
            notes: 'Needed for winter collection'
        },
        {
            materialName: 'Denim Fabric',
            from: 'Supplier',
            to: 'Warehouse',
            movementType: 'INCOMING',
            quantity: 300,
            unitOfMeasure: 'meters',
            status: 'Fulfilled',
            notes: 'Quality check passed'
        },
        {
            materialName: 'Silk Fabric',
            from: 'Warehouse',
            to: 'Department D',
            movementType: 'OUTGOING',
            quantity: 50,
            unitOfMeasure: 'meters',
            status: 'Completed',
            notes: 'Handle with care, delicate material'
        },
        {
            materialName: 'Synthetic Leather',
            from: 'Warehouse',
            to: 'Supplier',
            movementType: 'RETURN',
            quantity: 20,
            unitOfMeasure: 'sheets',
            status: 'Rejected',
            notes: 'Return due to defects'
        },
        {
            materialName: 'Linen Fabric',
            from: 'Supplier',
            to: 'Warehouse',
            movementType: 'INCOMING',
            quantity: 200,
            unitOfMeasure: 'meters',
            status: 'Cancelled',
            notes: 'Order cancelled by supplier'
        }
    ] });
});
  



// Start the server
app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});