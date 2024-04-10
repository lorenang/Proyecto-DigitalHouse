module.exports = (sequelize, DataTypes) => {
    const Products  = sequelize.define('Products', {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        product_description: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        product_stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_pricePurchase: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        product_priceSale: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        product_expirationDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        product_image: {
            type: DataTypes.CHAR(250),
            allowNull: true
        }
    }, {
        timestamps: false 
    });

    Products.associate = models => {
        Products.belongsTo(models.Categories, {
            foreignKey: 'category_id',
            as: 'category'
        });
    };

    return Products;
};
