module.exports = (sequelize, DataTypes) => {
    const Categories  = sequelize.define('Categories', 
        {
            category_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            category_description: {
                type: DataTypes.STRING(30),
                allowNull: true // No debe ser nulo
            },
        }, 
        { 
            timestamps: false // Esto evita que Sequelize agregue automáticamente las columnas createdAt y updatedAt
        }
    );
    Categories.associate = models => {
        Categories.hasMany(models.Products, {
            foreignKey: 'category_id',
            as: 'products'
        });
    };
    return Categories;
};



