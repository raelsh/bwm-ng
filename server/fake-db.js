const Rental = require('./models/rental');
const UserModel = require('./models/user');

class FakeDb {
    constructor() {
        this.rentals = [{
            title: "Nice view on ocean",
            city: "San Francisco",
            street: "Main street",
            category: "condo",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 4,
            shared: true,
            description: "Very nice apartment in center of the city.",
            dailyRate: 43
        },
        {
            title: "Modern apartment in center",
            city: "New York",
            street: "Time Square",
            category: "apartment",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 1,
            shared: false,
            description: "Very nice apartment in center of the city.",
            dailyRate: 11
        },
        {
            title: "Old house in nature",
            city: "Spisska Nova Ves",
            street: "Banicka 1",
            category: "house",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 5,
            shared: true,
            description: "Very nice apartment in center of the city.",
            dailyRate: 23
        }]

        this.users=[{
            username: "test user",
            email: "testq@gmail.com",
            password:"testtest"
        }]
    }

    pushDataToDb(){
        const user = new UserModel(this.users[0]);

        this.rentals.forEach((rental)=>{
            const newRental=new Rental(rental);
            newRental.user=user;
            user.rentals.push(newRental);
            newRental.save();
        });

        user.save();
    }

    async seedDb(){
        await this.clearDb();
        this.pushDataToDb();
    }

    async clearDb(){
        await UserModel.deleteMany();
        await Rental.deleteMany();
    }
}

module.exports=FakeDb;