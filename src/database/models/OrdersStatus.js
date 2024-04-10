module.exports = (sequelize, DataTypes) => {
    const OrderStatus = sequelize.define('OrderStatus', {
        order_status_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_status_description: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    OrderStatus.associate = models => {
        OrderStatus.hasMany(models.Orders, {
            foreignKey: 'order_status_id',
            as: 'orders'
        });
    };

    return OrderStatus;
};
