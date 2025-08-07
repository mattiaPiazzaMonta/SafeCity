'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('emergency_types', [
      { label: 'Terremoto', icon_path: '/icone circolari/formattata_4.png' },
      { label: 'Alluvione', icon_path: '/icone circolari/formattata_6.png' },
      { label: 'Frana', icon_path: '/icone circolari/formattata_2.png' },
      { label: 'Eruzione vulcanica', icon_path: '/icone circolari/formattata_3.png' },
      { label: 'Maremoto', icon_path: '/icone circolari/formattata_1.png' },
      { label: 'Tempesta', icon_path: '/icone circolari/formattata_5.png' },
      { label: 'Tromba-aria', icon_path: '/icone circolari/formattata_7.png' },
      { label: 'Grandinata', icon_path: '/icone circolari/formattata_12.png' },
      { label: 'Nevicata', icon_path: '/icone circolari/formattata_13.png' },
      { label: 'Siccità', icon_path: '/icone circolari/formattata_11.png' },
      { label: 'Ondata di calore', icon_path: '/icone circolari/formattata_10.png' },
      { label: 'Ondata di Gelo', icon_path: '/icone circolari/formattata_9.png' },
      { label: 'Incendio', icon_path: '/icone circolari/formattata_14.png' },
      { label: 'Incidente', icon_path: '/icone circolari/formattata_22.png' },
      { label: 'Viabilità modificata', icon_path: '/icone circolari/formattata_19.png' },
      { label: 'Rottura condutture gas/acqua', icon_path: '/icone circolari/formattata_8.png' },
      { label: 'Caduta albero su strada/edificio', icon_path: '/icone circolari/formattata_17.png' },
      { label: 'Crollo struttura', icon_path: '/icone circolari/formattata_26.png' },
      { label: 'Blackout elettrico', icon_path: '/icone circolari/formattata_21.png' },
      { label: 'Guasto rete idrica/gas', icon_path: '/icone circolari/formattata_23.png' },
      { label: 'Malfunzionamento semafori', icon_path: '/icone circolari/formattata_15.png' },
      { label: 'Sversamento di sostanze tossiche', icon_path: '/icone circolari/formattata_16.png' },
      { label: 'Atto terroristico', icon_path: '/icone circolari/formattata_24.png' },
      { label: 'Manifestazione pericolosa', icon_path: '/icone circolari/formattata_20.png' },
      { label: 'Persona scomparsa', icon_path: '/icone circolari/formattata_18.png' },
      { label: 'Avvistamento Animale pericoloso vagante', icon_path: '/icone circolari/formattata_25.png' },
      { label: 'Dissesto stradale / Buche', icon_path: '/icone circolari/formattata_27.png' }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('emergency_types', null, {});
  }
};

