import fp from 'fastify-plugin';

const authenticate = fp((fastify) => {
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      console.error(error);
      reply.code(401).send({ message: 'unauthorized' });
    }
  });
});

export default authenticate;
