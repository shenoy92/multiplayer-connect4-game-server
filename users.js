const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  console.log(users)
  const existingUser = users.find((user) => user.room === room && user.name === name);
  if(users.length>=2) return {error:'Only two players can play in a room'}

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  let user = { id, name, room };
  users.push(user);
  user = {...user, player: users.length};
  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

module.exports = { addUser, getUser,removeUser};