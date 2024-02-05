# Breadit - Clone do Reddit funcional

![Next.js](https://img.shields.io/badge/Next.js-v14-blue?style=for-the-badge&logo=next.js)
![NextAuth](https://img.shields.io/badge/Next%20Auth-v4-green?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-v4-purple?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v2-blue?style=for-the-badge&logo=tailwind-css)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-v7-blue?style=for-the-badge&logo=react)

![Breadit](https://github.com/Snarloff/breadit/assets/46792575/5be534d3-1692-456a-9d91-7045fcbec4cf)

https://github.com/Snarloff/breadit/assets/46792575/2f8b3c5f-005f-4076-a525-286ddea70837


Breadit é um projeto funcional que consiste em um clone da plataforma Reddit. Desenvolvido utilizando Next.js 14, NextAuth para autenticação, Prisma ORM para interação com o banco de dados, Tailwind CSS para estilização, Next Theme para alternância de temas, Shadcn UI para componentes, e outras tecnologias modernas.

## Funcionalidades

- **Autenticação Segura**: Utiliza NextAuth para autenticação, proporcionando um sistema de login seguro.

- **Temas Personalizáveis**: Oferece suporte a temas claro e escuro para aprimorar a experiência do usuário.

- **Gestão de Subreddits**: Permite a criação, edição e exclusão de subreddits.

- **Sistema de Votos**: Possui um sistema de votação para posts e comentários.

- **Upload de Imagens**: Utiliza o UploadThing para facilitar o upload de imagens na nuvem.

- **Editor de Texto**: Integra o EditorJS para criação de publicações com formatação rica.

- **Validações Eficientes**: Utiliza React Hook Form com Zod para validações eficientes nos formulários.

- **React Dropzone e Lucide-React**: Facilita a manipulação de uploads e utiliza ícones de Lucide-React.

- **Cache com Redis**: Implementa o Redis para fazer o cache de determinadas requisições, aprimorando a eficiência do sistema.

## Como Rodar o Projeto

1. Clone este repositório para sua máquina local

2. Acesse o diretório do projeto:

    ```bash
    cd breadit
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Configure as variáveis de ambiente no arquivo `.env`:

    ```env
    DATABASE_URL=
    NEXTAUTH_SECRET=

    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=

    UPLOADTHING_SECRET=
    UPLOADTHING_APP_ID=

    REDIS_URL=
    REDIS_SECRET=
    ```

5. Execute as migrações do Prisma:

    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

6. Inicie o servidor de desenvolvimento:

    ```bash
    npm run dev
    ```

7. Acesse o aplicativo em seu navegador em [http://localhost:3000](http://localhost:3000).

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorar este projeto.

## Agradecimentos

Obrigado por explorar o Breadit! Espero que este clone funcional do Reddit seja útil para seus estudos e práticas.

## Licença

Este projeto está disponível sob a MIT License. Consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.
