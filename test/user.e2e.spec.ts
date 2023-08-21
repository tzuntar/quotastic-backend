import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/modules/app.module';
import { User } from '../src/entities/user.entity';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let userRepository: Repository<User>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        userRepository = await moduleFixture.get('UserRepository');
        await app.init();
    });

    afterAll(async () => await app.close());

    it('GET /users - should return an array of users', () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect(200);
    });

});
