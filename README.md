# Lista de Compras

Aplicação de lista de compras desenvolvida com React, TypeScript, Vite e Firebase.

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## PWA e uso offline

A aplicação pode ser instalada como um Progressive Web App (PWA). O service worker mantém o shell da aplicação e os arquivos estáticos em cache. O Cloud Firestore usa persistência local no IndexedDB para permitir ler dados já carregados e enfileirar alterações enquanto o dispositivo estiver offline.

### Testar localmente

1. Execute `npm run build` e depois `npm run preview`. O service worker só é registrado em produção.
2. Abra a URL do preview, entre com sua conta e aguarde a lista carregar.
3. No Chrome, abra DevTools → Application e confirme que o service worker está ativo e o manifesto foi carregado.
4. Instale o app pelo menu do navegador. Em um dispositivo móvel, publique primeiro em um host HTTPS para fazer o teste real.
5. Abra o app instalado com internet e carregue sua lista pelo menos uma vez.
6. Ative o modo avião e reabra o app. Confirme que os itens já carregados continuam visíveis.
7. Adicione um item, marque/desmarque um item e remova um item offline. Feche e reabra o app ainda offline para verificar o cache local.
8. Volte a conectar à internet e confirme no Firebase que as alterações foram sincronizadas.

### Observações importantes

- O app precisa ser aberto online pelo menos uma vez para baixar o shell e os dados do usuário.
- Login por Google/GitHub continua exigindo conexão na primeira autenticação. Uma sessão Firebase já restaurada permite reabrir o app offline.
- A persistência web do Firestore pode não ser ativada se outra aba estiver usando o cache ou se o navegador não suportar IndexedDB persistente. Consulte o console do navegador caso o teste offline falhe.
- Em dispositivos compartilhados, evite manter a sessão iniciada se outras pessoas puderem acessar os dados locais.
- O teste de produção em Android e iPhone ainda é necessário antes de considerar a implementação pronta para usuários.

