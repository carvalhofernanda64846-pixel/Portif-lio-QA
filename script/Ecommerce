// O array de dados de teste é o mesmo
const produtos = [
    'Sauce Labs Backpack', 
    'Sauce Labs Bike Light', 
    'Sauce Labs Bolt T-Shirt'
];

describe('Verificação de Produtos no E-commerce', () => {
    
    it('Deve logar e adicionar itens ao carrinho', () => {
        
        // 1. Visitar a página
        cy.visit('https://www.saucedemo.com/');

        // 2. Fazer Login
        cy.get('#user-name').type('standard_user');
        cy.get('#password').type('secret_sauce');
        cy.get('#login-button').click();

        // 3. O LOOP (Seu aprendizado!)
        // O Cypress irá repetir tudo que está aqui dentro para cada produto.
        for (const nomeProduto of produtos) {
            
            // 3a. VERIFICAÇÃO 1: O título do produto existe na página.
            cy.contains('.inventory_item_name', nomeProduto).should('be.visible');
            cy.log(`✅ Produto visível: ${nomeProduto}`);

            // 3b. AÇÃO: Encontrar e clicar no botão "Add to cart"

            // PAUSA DE 1 SEGUNDO (1000ms)
    //cy.wait(1000); 
    //cy.log( `🛒 Adicionado ao carrinho: ${nomeProduto}`);
//
            cy.contains('.inventory_item', nomeProduto)
                .find('button')
                .click();
        cy.log( `🛒 Adicionado ao carrinho: ${nomeProduto}`);
        }

        // 4. VERIFICAÇÃO FINAL: Checar o carrinho
        cy.get('.shopping_cart_link').click();
        
        // Asserção: Verifica se o número de itens no carrinho é igual ao tamanho do nosso array.
        cy.get('.cart_item').should('have.length', produtos.length);
        cy.log('🎉 Teste Concluído! O carrinho está correto.');
    });// 
});
