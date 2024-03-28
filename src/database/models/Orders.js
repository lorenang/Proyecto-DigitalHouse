module.exports = (sequelize, DataTypes) => {
    const Orders = sequelize.define('Orders', {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_address: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        order_total: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    Orders.associate = models => {
        Orders.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Orders.belongsTo(models.OrderStatus, {
            foreignKey: 'order_status_id',
            as: 'status'
        });
        Orders.hasMany(models.OrderItem, {
            foreignKey: 'order_id',
            as: 'items'
        });
    };

    return Orders;
};