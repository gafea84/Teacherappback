const { checkIsEmpty, createDefaultRoles } = require('../models/roles.model');
const bcrypt = require('bcrypt');
const usuarios = require('../models/usuarios.model');

const loadDefaultData = async () => {
    const bcrypt = require('bcrypt');

    // Roles por defecto.
    try {
        const result = await checkIsEmpty();        
        if (result.isEmpty) {
            createDefaultRoles();
        }
    } catch (exception) {
        console.log('Error comprobando existencia de roles')
    }

    // Administrador por defecto.
    try {      
      const administrador      = await usuarios.getAdministrador();
      const administradorRolId = require('../models/roles.model').adminRoleId;
      if (administrador === null) {
        await usuarios.create({
          nombreCompleto: process.env.DEFAULT_ADMIN_NOMBRE_COMPLETO,
          userName: process.env.DEFAULT_ADMIN_USERNAME,
          email: process.env.DEFAULT_ADMIN_EMAIL,
          password: bcrypt.hashSync(process.env.DEFAULT_ADMIN_PASSWORD, 8),
          rolId: administradorRolId
        });
      }
    } catch (exception) {
        console.log('Error al comprobar si hay administradores')
    };
}

module.exports = { loadDefaultData };