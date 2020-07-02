import postsData from './postsData';

const profileDummy = {
  id: '1',
  mentor: true,
  firstName: 'Oleh',
  lastName: 'Busko',
  bio: "Description that doesn't mean a alot but is here just to serve as a placeholder",
  areas: ['Computer Science', 'React.js', 'Data Science'],
  posts: postsData.filter(post => post.authorId === 1)
}

export default profileDummy;
