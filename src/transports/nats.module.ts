import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE } from 'src/config';

const natsClientConfig: any = {
  name: NATS_SERVICE,
  transport: Transport.NATS,
  options: { servers: envs.natsServers },
};

@Module({
  imports: [ClientsModule.register([natsClientConfig])],
  exports: [ClientsModule.register([natsClientConfig])],
})
export class NatsModule {}
