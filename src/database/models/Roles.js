module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define('Roles', {
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        role_description: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        timestamps: false
    });

    Roles.associate = models => {
        Roles.hasMany(models.Users, {
            foreignKey: 'role_id',
            as: 'users'
        });
    };

    return Roles;
};