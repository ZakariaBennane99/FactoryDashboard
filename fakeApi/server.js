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
            "firstName": "Hamid",
            "lastName": "Abdelhamid",
            "userName": "hamid.abdel",
            "password": "password123",
            "phoneNumber": "123-456-7890",
            "email": "hamid.abdel@example.com",
            "category": "Production",
            "department": "Tailoring Division",
            "userRole": 'Production Manager',
            "active": false
        },
        { 
            "firstName": "Sam",
            "lastName": "Kfouri",
            "userName": "sam.kfouri",
            "password": "password123",
            "phoneNumber": "321-654-0987",
            "email": "sam.kfouri@example.com",
            "category": "Production",
            "department": "Printing",
            "userRole": 'Production Manager',
            "active": true
        },
        { 
            "firstName": "Omar",
            "lastName": "Akil",
            "userName": "omar.akil",
            "password": "password123",
            "phoneNumber": "456-123-7890",
            "email": "omar.akil@example.com",
            "category": "Production",
            "department": "Cutting Division II",
            "userRole": 'Production Manager',
            "active": true
        },
        { 
            "firstName": "Mohammed",
            "lastName": "Atouani",
            "userName": "mohammed.atouani",
            "password": "password123",
            "phoneNumber": "654-321-0987",
            "email": "mohammed.atouani@example.com",
            "category": "Production",
            "department": "Cutting Division I",
            "userRole": 'Production Manager',
            "active": true
        },
        { 
            "firstName": "Mouad",
            "lastName": "Moutaouakil",
            "userName": "mouad.moutaouakil",
            "password": "password123",
            "phoneNumber": "789-456-1230",
            "email": "mouad.moutaouakil@example.com",
            "category": "Management",
            "department": "Finance Office",
            "userRole": 'Managerial Head',
            "active": false
        },
        { 
            "firstName": "Chris",
            "lastName": "Tucker",
            "userName": "chris.tucker",
            "password": "password123",
            "phoneNumber": "987-654-3210",
            "email": "chris.tucker@example.com",
            "category": "Management",
            "department": "Engineering Office",
            "userRole": 'Managerial Head',
            "active": true
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
            phone: "+963 1234 567",
            email: "contact@aleppotextiles.sy",
            address: "123 Industrial Zone, Aleppo, Syria"
        },
        {
            id: 2,
            name: "Damascus Fabrics Co.",
            phone: "+963 9876 543",
            email: "info@damascusfabrics.sy",
            address: "456 Business District, Damascus, Syria"
        },
        {
            id: 3,
            name: "Latakia Weaving Works",
            phone: "+963 3456 789",
            email: "sales@latakia-weaving.sy",
            address: "789 Seaside Avenue, Latakia, Syria"
        },
        {
            id: 4,
            name: "Homs Cotton Suppliers",
            phone: "+963 2345 678",
            email: "support@homscotton.sy",
            address: "321 Cotton Drive, Homs, Syria"
        },
        {
            id: 5,
            name: "Tartous Textile Solutions",
            phone: "+963 5432 109",
            email: "inquiries@tartoustextile.sy",
            address: "654 Harbor Road, Tartous, Syria"
        },
        {
            id: 6,
            name: "Raqqa Garment Makers",
            phone: "+963 6789 012",
            email: "contact@raqqagarments.sy",
            address: "987 Fabric Lane, Raqqa, Syria"
        },
        {
            id: 7,
            name: "Deir Ezzor Cloth Co.",
            phone: "+963 7890 345",
            email: "info@deirezzorcloth.sy",
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
  

// product catalogues
app.get('/product-catalogues', (req, res) => {
    res.json({ productCatalogues: [
        {
            name: 'Cotton Fabric',
            description: 'This category includes various grades of cotton fabric.'
        },
        {
            name: 'Wool Fabric',
            description: 'This section covers different types of wool fabric.'
        },
        {
            name: 'Silk Fabric',
            description: 'Here we have our collection of silk fabrics.'
        },
        {
            name: 'Polyester Fabric',
            description: 'This category encompasses our range of polyester fabrics.'
        },
        {
            name: 'Leather Material',
            description: 'This section includes various types of leather material.'
        },
        {
            name: 'Denim Fabric',
            description: 'Here you will find our denim fabric options, characterized.'
        },
        {
            name: 'Linen Fabric',
            description: 'This category includes our linen fabric, valued for its.'
        }
    ]  });
});


// product catalogues textiles
app.get('/product-catalogue-textiles', (req, res) => {
    res.json({ textiles: [
        {
            textileName: 'Basic Cotton',
            textileType: 'Cotton',
            composition: '100% Organic Cotton',
            description: 'A staple fabric known for its breathability and softness, ideal for everyday casual wear.'
        },
        {
            textileName: 'Merino Wool',
            textileType: 'Wool',
            composition: '100% Merino Wool',
            description: 'High-quality wool known for its exceptional warmth and moisture-wicking properties, perfect for premium winter garments.'
        },
        {
            textileName: 'Charmeuse Silk',
            textileType: 'Silk',
            composition: '100% Mulberry Silk',
            description: 'Luxurious silk with a glossy sheen on one side and a matte finish on the other, often used in high-end fashion for dresses and blouses.'
        },
        {
            textileName: 'Sports Polyester',
            textileType: 'Polyester',
            composition: '100% Polyester',
            description: 'Lightweight and durable fabric with quick-dry properties, commonly used in sportswear and active apparel.'
        },
        {
            textileName: 'Nappa Leather',
            textileType: 'Leather',
            composition: '100% Full-Grain Leather',
            description: 'Soft, full-grain leather known for its durability and smooth texture, widely used in premium leather goods.'
        },
        {
            textileName: 'Stretch Denim',
            textileType: 'Denim',
            composition: '98% Cotton, 2% Elastane',
            description: 'Durable denim fabric blended with elastane for added stretch, ideal for comfortable, form-fitting jeans.'
        },
        {
            textileName: 'Irish Linen',
            textileType: 'Linen',
            composition: '100% Linen',
            description: 'High-quality linen known for its natural luster and strength, perfect for luxury linen garments and home textiles.'
        }
    ]
     });
});


// product catalogues details
app.get('/product-catalogue-details', (req, res) => {
    res.json({ details: [
        {
            "ProductCatalogId": "PC101",
            "Category1": "Outerwear",
            "Category2": "Jackets",
            "Season": "Winter",
            "Textile": "Polyester",
            "TemplatePattern": "Solid",
            "TemplateType": "Windbreaker",
            "StandardWeight": 500,
            "Grammage": 250,
            "Description": "Durable windbreaker for chilly winter days."
        },
        {
            "ProductCatalogId": "PC102",
            "Category1": "Tops",
            "Category2": "Shirts",
            "Season": "Summer",
            "Textile": "Linen",
            "TemplatePattern": "Plain",
            "TemplateType": "Button-Up",
            "StandardWeight": 200,
            "Grammage": 150,
            "Description": "Light and breathable linen shirt for summer comfort."
        },
        {
            "ProductCatalogId": "PC103",
            "Category1": "Bottoms",
            "Category2": "Jeans",
            "Season": "Spring",
            "Textile": "Denim",
            "TemplatePattern": "Distressed",
            "TemplateType": "Straight Cut",
            "StandardWeight": 750,
            "Grammage": 300,
            "Description": "Versatile straight cut jeans with a modern distressed look."
        },
        {
            "ProductCatalogId": "PC104",
            "Category1": "Tops",
            "Category2": "T-Shirts",
            "Season": "Spring",
            "Textile": "Cotton",
            "TemplatePattern": "Graphic",
            "TemplateType": "Crew Neck",
            "StandardWeight": 180,
            "Grammage": 160,
            "Description": "Soft cotton crew neck t-shirt with a trendy graphic design."
        },
        {
            "ProductCatalogId": "PC105",
            "Category1": "Activewear",
            "Category2": "Leggings",
            "Season": "Autumn",
            "Textile": "Spandex",
            "TemplatePattern": "Print",
            "TemplateType": "High Waist",
            "StandardWeight": 250,
            "Grammage": 200,
            "Description": "High waist leggings perfect for all types of workouts."
        },
        {
            "ProductCatalogId": "PC106",
            "Category1": "Undergarments",
            "Category2": "Socks",
            "Season": "Summer",
            "Textile": "Cotton Blend",
            "TemplatePattern": "Ribbed",
            "TemplateType": "Ankle Length",
            "StandardWeight": 60,
            "Grammage": 100,
            "Description": "Comfortable ankle length socks with a ribbed pattern."
        },
        {
            "ProductCatalogId": "PC107",
            "Category1": "Accessories",
            "Category2": "Hats",
            "Season": "Autumn",
            "Textile": "Straw",
            "TemplatePattern": "Woven",
            "TemplateType": "Sun Hat",
            "StandardWeight": 120,
            "Grammage": 180,
            "Description": "Stylish sun hat to provide shade on sunny days."
        }
    ] });
});


// product catalogue seasons mock-up data
app.get('/product-catalogue-seasons', (req, res) => {
    res.json({
        seasons: [
            {
                seasonName: "Winter",
                startDate: "01-12-2023",
                endDate: "28-02-2024",
                description: "Featuring heavy textiles and layers."
            },
            {
                seasonName: "Spring",
                startDate: "01-03-2024",
                endDate: "31-05-2024",
                description: "Incorporating lighter fabrics and pastel colors."
            },
            {
                seasonName: "Summer",
                startDate: "01-06-2024",
                endDate: "31-08-2024",
                description: "Linen shirts and breathable cotton."
            },
            {
                seasonName: "Fall",
                startDate: "01-09-2024",
                endDate: "30-11-2024",
                description: "Fall collection features warm tones and versatile pieces."
            },
            {
                seasonName: "Winter",
                startDate: "01-11-2024",
                endDate: "31-12-2024",
                description: "Range of mid-weight fabrics and early winter styles."
            },
            {
                seasonName: "Summer",
                startDate: "01-08-2024",
                endDate: "30-09-2024",
                description: "Pieces suitable for the transitioning weather."
            },
            {
                seasonName: "Spring",
                startDate: "01-02-2024",
                endDate: "31-03-2024",
                description: "Layers and vibrant colors to welcome the new season."
            }
        ]
    });
});

// product templates
app.get('/templates', (req, res) => {
    res.json({
        templates: [
            {
              productCatalogueDetail: "Cotton Fabric",
              templateName: "Basic Tee",
              description: "A simple and versatile cotton T-shirt template suitable for all-day wear.",
              fileName: "basic_tee_template.png"
            },
            {
              productCatalogueDetail: "Wool Fabric",
              templateName: "Winter Sweater",
              description: "A warm wool sweater template, perfect for cold winter days.",
              fileName: "winter_sweater_template.png"
            },
            {
              productCatalogueDetail: "Polyester Fabric",
              templateName: "Sports Jacket",
              description: "A lightweight and durable sports jacket template, ideal for active wear.",
              fileName: "sports_jacket_template.png"
            },
            {
              productCatalogueDetail: "Linen Fabric",
              templateName: "Summer Pants",
              description: "Breathable linen pants template, designed for comfort in hot weather.",
              fileName: "summer_pants_template.png"
            },
            {
              productCatalogueDetail: "Denim Fabric",
              templateName: "Classic Jeans",
              description: "The classic jeans template with a timeless design for casual wear.",
              fileName: "classic_jeans_template.png"
            },
            {
              productCatalogueDetail: "Silk Fabric",
              templateName: "Evening Dress",
              description: "An elegant evening dress template crafted from fine silk.",
              fileName: "evening_dress_template.png"
            },
            {
              productCatalogueDetail: "Synthetic Blend",
              templateName: "Activewear Top",
              description: "A synthetic blend top template optimized for workout and gym sessions.",
              fileName: "activewear_top_template.png"
            }
          ]
    });
});


// product templates sizs
app.get('/template-sizes', (req, res) => {
    res.json({
        sizes: [
            {
              size: 'S',
              template: 'Basic Tee',
              measurementName: 'Chest Width',
              measurementValue: 18,
              measurementUnit: 'inches',
              description: 'Small size for Basic Tee',
              templateSizeType: 'Cutting'
            },
            {
              size: 'M',
              template: 'Winter Sweater',
              measurementName: 'Sleeve Length',
              measurementValue: 24,
              measurementUnit: 'inches',
              description: 'Medium size for Winter Sweater',
              templateSizeType: 'Dressup',
              components: [
                {
                  componentName: 'Sleeve',
                  description: 'Wool sleeve for Winter Sweater',
                  material: 'Wool',
                  template: 'Sleeve Template',
                  quantity: '2',
                  unitOfMeasure: 'pieces'
                }
              ]
            },
            {
              size: 'L',
              template: 'Sports Jacket',
              measurementName: 'Total Length',
              measurementValue: 27,
              measurementUnit: 'inches',
              description: 'Large size for Sports Jacket',
              templateSizeType: 'Cutting',
              components: [
                {
                  componentName: 'Zipper',
                  description: 'Metal zipper for Sports Jacket',
                  material: 'Metal',
                  template: 'Zipper Template',
                  quantity: '1',
                  unitOfMeasure: 'piece'
                }
              ]
            },
            {
              size: 'XL',
              template: 'Summer Pants',
              measurementName: 'Waist Width',
              measurementValue: 34,
              measurementUnit: 'inches',
              description: 'Extra Large size for Summer Pants',
              templateSizeType: 'Dressup',
              components: [
                {
                  componentName: 'Button',
                  description: 'Sturdy button for Summer Pants',
                  material: 'Plastic',
                  template: 'Button Template',
                  quantity: '1',
                  unitOfMeasure: 'piece'
                }
              ]
            },
            {
              size: 'XXL',
              template: 'Classic Jeans',
              measurementName: 'Hip Width',
              measurementValue: 40,
              measurementUnit: 'inches',
              description: 'Double Extra Large size for Classic Jeans',
              templateSizeType: 'Cutting',
              components: [
                {
                  componentName: 'Denim Patch',
                  description: 'Denim patch for Classic Jeans',
                  material: 'Denim',
                  template: 'Patch Template',
                  quantity: '2',
                  unitOfMeasure: 'pieces'
                }
              ]
            },
            {
              size: 'M',
              template: 'Evening Dress',
              measurementName: 'Shoulder Width',
              measurementValue: 15,
              measurementUnit: 'inches',
              description: 'Medium size for Evening Dress',
              templateSizeType: 'Dressup',
              components: [
                {
                  componentName: 'Beads',
                  description: 'Decorative beads for Evening Dress',
                  material: 'Glass',
                  template: 'Beads Template',
                  quantity: '50',
                  unitOfMeasure: 'pieces'
                }
              ]
            }
          ]
    });
});


// product templates sizs
app.get('/manufacturing-stages', (req, res) => {
    res.json({
        manufacturingStages: [
            {
              stageNumber: 1,
              stageName: "Design Concept",
              workDescription: "Sketch and initial design of the product",
              duration: 120,
              description: "Initial concept design and ideation phase",
              template: "Basic Tee",
              department: "Engineering Office"
            },
            {
              stageNumber: 2,
              stageName: "Material Selection",
              workDescription: "Selection of fabrics and necessary materials",
              duration: 90,
              description: "Choosing the right fabric and materials for the product",
              template: "Classic Jeans",
              department: "Production Plant 1"
            },
            {
              stageNumber: 3,
              stageName: "Prototyping",
              workDescription: "Creation of a product prototype",
              duration: 180,
              description: "Developing a prototype to visualize the final product",
              template: "Basic Tee",
              department: "Cutting Division"
            },
            {
              stageNumber: 4,
              stageName: "Initial Testing",
              workDescription: "Testing the prototype under various conditions",
              duration: 150,
              description: "Testing for durability, design, and functionality",
              template: "Classic Jeans",
              department: "Engineering Office"
            },
            {
              stageNumber: 5,
              stageName: "Cost Estimation",
              workDescription: "Calculating the cost of production and materials",
              duration: 60,
              description: "Estimating the total cost for manufacturing",
              template: "Basic Tee",
              department: "Finance Office"
            },
            {
              stageNumber: 6,
              stageName: "Final Design",
              workDescription: "Finalizing the product design",
              duration: 210,
              description: "Final adjustments and preparations for mass production",
              template: "Classic Jeans",
              department: "Accounting Office"
            },
            {
              stageNumber: 7,
              stageName: "Mass Production",
              workDescription: "Starting the production at scale",
              duration: 300,
              description: "Manufacturing the product at a large scale",
              template: "Basic Tee",
              department: "Production Plant 1"
            }
        ]
    });
});


// template patterns
app.get('/template-patterns', (req, res) => {
    res.json({
        patterns:[
            {
              templatePatternName: "Basic Tee",
              description: "A simple and versatile t-shirt design suitable for casual wear."
            },
            {
              templatePatternName: "Classic Jeans",
              description: "Traditional denim jeans with a timeless cut and fit."
            },
            {
              templatePatternName: "Summer Dress",
              description: "A light and airy dress perfect for warm summer days."
            },
            {
              templatePatternName: "Formal Shirt",
              description: "A crisp and professional shirt suitable for business or formal events."
            },
            {
              templatePatternName: "Puffer Jacket",
              description: "A warm, insulated jacket designed for cold weather."
            },
            {
              templatePatternName: "Yoga Pants",
              description: "Flexible and comfortable pants designed for yoga and other fitness activities."
            },
            {
              templatePatternName: "Knit Sweater",
              description: "A cozy sweater made from knitted fabric, perfect for cooler weather."
            }
        ]          
    });
});


// template types
app.get('/template-types', (req, res) => {
    res.json({
        types: [
            {
              templateTypeName: "Casual Wear",
              description: "Relaxed and informal clothing suitable for everyday use."
            },
            {
              templateTypeName: "Formal Attire",
              description: "Sophisticated and elegant clothing designed for formal events."
            },
            {
              templateTypeName: "Sportswear",
              description: "Clothing designed for sports or physical exercise, focusing on comfort and flexibility."
            },
            {
              templateTypeName: "Outerwear",
              description: "Clothing worn outdoors for warmth or protection, including coats, jackets, and overcoats."
            },
            {
              templateTypeName: "Workwear",
              description: "Durable and functional clothing designed for manual labor or work environments."
            },
            {
              templateTypeName: "Evening Wear",
              description: "Elegant clothing suitable for evening social events."
            },
            {
              templateTypeName: "Beachwear",
              description: "Lightweight and comfortable clothing suitable for beach activities and summer wear."
            }
          ]         
    });
});

// orders
app.get('/orders', (req, res) => {
  res.json({
      orders: [
        {
          orderNumber: 1001,
          orderDate: "01-10-2024",
          totalAmount: 1500.00,
          status: "PENDING",
          season: "Spring"
        },
        {
          orderNumber: 1002,
          orderDate: "02-12-2024",
          totalAmount: 2700.00,
          status: "APPROVED",
          season: "Spring"
        },
        {
          orderNumber: 1003,
          orderDate: "03-20-2024",
          totalAmount: 3200.00,
          status: "FULFILLED",
          season: "Summer"
        },
        {
          orderNumber: 1004,
          orderDate: "04-25-2024",
          totalAmount: 1100.00,
          status: "CANCELLED",
          season: "Summer"
        },
        {
          orderNumber: 1005,
          orderDate: "05-30-2024",
          totalAmount: 2900.00,
          status: "COMPLETED",
          season: "Autumn"
        },
        {
          orderNumber: 1006,
          orderDate: "04-06-2024",
          totalAmount: 2100.00,
          status: "ONGOING",
          season: "Autumn"
        },
        {
          orderNumber: 1007,
          orderDate: "09-07-2024",
          totalAmount: 1800.00,
          status: "REJECTED",
          season: "Winter"
        }
      ]               
  });
});


// orders
app.get('/order-details', (req, res) => {
  res.json({
      details: [
        {
          orderNumber: 1001,
          quantityDetails: "50 units of size M, 30 units of size L",
          templatePattern: "Basic Tee",
          productCatalogue: "Summer Collection 2024",
          modelName: "Sunshine Tee",
          modelQuantity: 80
        },
        {
          orderNumber: 1002,
          quantityDetails: "100 units of size 32, 150 units of size 34",
          templatePattern: "Classic Jeans",
          productCatalogue: "Autumn Collection 2024",
          modelName: "Rugged Denim",
          modelQuantity: 250
        },
        {
          orderNumber: 1003,
          quantityDetails: "40 units of size S, 60 units of size M",
          templatePattern: "Summer Dress",
          productCatalogue: "Spring Collection 2024",
          modelName: "Breezy Sundress",
          modelQuantity: 100
        },
        {
          orderNumber: 1004,
          quantityDetails: "30 units of size 40, 40 units of size 42",
          templatePattern: "Formal Shirt",
          productCatalogue: "Winter Collection 2024",
          modelName: "Classic White Shirt",
          modelQuantity: 70
        },
        {
          orderNumber: 1005,
          quantityDetails: "50 units of size XL, 70 units of size XXL",
          templatePattern: "Puffer Jacket",
          productCatalogue: "Winter Collection 2024",
          modelName: "Winter Puffer",
          modelQuantity: 120
        },
        {
          orderNumber: 1006,
          quantityDetails: "60 units of size M, 40 units of size L",
          templatePattern: "Yoga Pants",
          productCatalogue: "Fitness Collection 2024",
          modelName: "Stretch Yoga Pants",
          modelQuantity: 100
        },
        {
          orderNumber: 1007,
          quantityDetails: "80 units of One Size",
          templatePattern: "Knit Sweater",
          productCatalogue: "Autumn Collection 2024",
          modelName: "Cozy Knit",
          modelQuantity: 80
        }
      ]               
  });
});


// ordersDetailColors
app.get('/detail-colors', (req, res) => {
  res.json({
      colors : [
        {
          orderId: 2001,
          colorName: "Red"
        },
        {
          orderId: 2002,
          colorName: "Blue"
        },
        {
          orderId: 2003,
          colorName: "Green"
        },
        {
          orderId: 2004,
          colorName: "Yellow"
        },
        {
          orderId: 2005,
          colorName: "Black"
        },
        {
          orderId: 2006,
          colorName: "White"
        },
        {
          orderId: 2007,
          colorName: "Purple"
        }
      ]               
  });
});


// order colors
app.get('/order-colors', (req, res) => {
  res.json({
      colors : [
        {
          colorName: "Red",
          colorCode: "#FF0000",
          description: "A vibrant and attention-grabbing color often associated with energy and passion."
        },
        {
          colorName: "Blue",
          colorCode: "#0000FF",
          description: "A calming color representing stability, trust, and confidence."
        },
        {
          colorName: "Green",
          colorCode: "#008000",
          description: "A refreshing color symbolizing growth, harmony, and nature."
        },
        {
          colorName: "Yellow",
          colorCode: "#FFFF00",
          description: "A bright and cheerful color associated with happiness, optimism, and creativity."
        },
        {
          colorName: "Black",
          colorCode: "#000000",
          description: "A powerful and sophisticated color representing elegance, formality, and mystery."
        },
        {
          colorName: "White",
          colorCode: "#FFFFFF",
          description: "A pure and simple color representing cleanliness, innocence, and peace."
        },
        {
          colorName: "Purple",
          colorCode: "#800080",
          description: "A rich color often associated with royalty, luxury, and ambition."
        }
      ]              
  });
});


// order colors
app.get('/order-sizes', (req, res) => {
  res.json({
      sizes : [
        {
          sizeName: "Small",
          description: "A size suitable for those who prefer a tighter, more snug fit."
        },
        {
          sizeName: "Medium",
          description: "The most common size offering a balance between snugness and comfort."
        },
        {
          sizeName: "Large",
          description: "A size for those who prefer a looser, more relaxed fit."
        },
        {
          sizeName: "Extra Large",
          description: "A larger size providing additional room and comfort for the wearer."
        },
        {
          sizeName: "2XL",
          description: "An extended size for those requiring extra room and comfort."
        },
        {
          sizeName: "3XL",
          description: "A further extended size to cater to diverse body shapes and preferences."
        },
        {
          sizeName: "Custom",
          description: "A bespoke size tailored to the specific measurements of the wearer."
        }
      ]            
  });
});


// order template types
app.get('/order-template-types', (req, res) => {
  res.json({
      templateTypes : [
        {
          orderDetailName: "Order Detail 1",
          templateTypeName: "Basic Tee"
        },
        {
          orderDetailName: "Order Detail 2",
          templateTypeName: "Classic Jeans"
        },
        {
          orderDetailName: "Order Detail 3",
          templateTypeName: "Summer Dress"
        },
        {
          orderDetailName: "Order Detail 4",
          templateTypeName: "Formal Shirt"
        },
        {
          orderDetailName: "Order Detail 5",
          templateTypeName: "Puffer Jacket"
        },
        {
          orderDetailName: "Order Detail 6",
          templateTypeName: "Yoga Pants"
        },
        {
          orderDetailName: "Order Detail 7",
          templateTypeName: "Knit Sweater"
        }
      ]           
  });
});


// order detail size
app.get('/order-detail-sizes', (req, res) => {
  res.json({
      orderSizes : [
        {
          orderDetailName: "Order Detail 1",
          sizeName: "Small"
        },
        {
          orderDetailName: "Order Detail 2",
          sizeName: "Medium"
        },
        {
          orderDetailName: "Order Detail 3",
          sizeName: "Large"
        },
        {
          orderDetailName: "Order Detail 4",
          sizeName: "Extra Large"
        },
        {
          orderDetailName: "Order Detail 5",
          sizeName: "2XL"
        },
        {
          orderDetailName: "Order Detail 6",
          sizeName: "3XL"
        },
        {
          orderDetailName: "Order Detail 7",
          sizeName: "Custom"
        }
      ]         
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});