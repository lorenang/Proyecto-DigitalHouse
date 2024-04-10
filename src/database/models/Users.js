module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_fullName: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        user_imagen: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: false
    });

    Users.associate = models => {
        Users.belongsTo(models.Roles, {
            foreignKey: 'rol_id',
            as: 'role'
        });
    };

    Users.associate = models => {
        Users.belongsTo(models.Rol, {
            foreignKey: 'rol_id',
            as: 'rol'
        });
    }

    return Users;
};