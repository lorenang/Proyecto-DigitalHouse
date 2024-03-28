module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        order_item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subtotal: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    OrderItem.associate = models => {
        OrderItem.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        });
        OrderItem.belongsTo(models.Orders, {
            foreignKey: 'order_item_id',
            as: 'order'
        });
    };

    return OrderItem;
};