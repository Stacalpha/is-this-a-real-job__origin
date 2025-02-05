export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Notifications', {
    notificationId: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    commentId: {
      type: Sequelize.UUID,
      allowNull: true,
      onDelete: 'CASCADE'
    },
    inviteId: {
      type: Sequelize.UUID,
      allowNull: false,
      onDelete: 'CASCADE'
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      onDelete: 'CASCADE'
    },
    type: {
      type: Sequelize.ENUM('upvote', 'comment'),
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    isSeen: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    }
  }),
  down: queryInterface => queryInterface.dropTable('Notifications')
};
