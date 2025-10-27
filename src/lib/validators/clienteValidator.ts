/**
 * Módulo de validação de dados do cliente para integração com Asaas
 */

export interface ValidacaoResultado {
  valido: boolean;
  erros: string[];
  avisos: string[];
}

export interface DadosCliente {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
  mobilePhone?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  externalReference?: string;
  notificationDisabled?: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
  observations?: string;
}

export class ClienteValidator {
  /**
   * Valida todos os dados do cliente
   */
  validarDadosCliente(cliente: DadosCliente): ValidacaoResultado {
    const erros: string[] = [];
    const avisos: string[] = [];

    // Validações obrigatórias
    if (!cliente.name || cliente.name.trim() === '') {
      erros.push('Nome é obrigatório');
    }

    if (!cliente.email || cliente.email.trim() === '') {
      erros.push('Email é obrigatório');
    } else if (!this.validarEmail(cliente.email)) {
      erros.push('Email inválido');
    }

    // Validação de CPF (obrigatório para pessoa física)
    if (cliente.cpfCnpj) {
      const cpfCnpj = cliente.cpfCnpj.replace(/\D/g, '');
      
      if (cpfCnpj.length === 11) {
        // É CPF
        if (!this.validarCPF(cpfCnpj)) {
          erros.push('CPF inválido');
        }
      } else if (cpfCnpj.length === 14) {
        // É CNPJ
        if (!this.validarCNPJ(cpfCnpj)) {
          erros.push('CNPJ inválido');
        }
      } else {
        erros.push('CPF/CNPJ deve ter 11 ou 14 dígitos');
      }
    }

    // Validação de telefone (opcional, mas se fornecido deve ser válido)
    if (cliente.phone && !this.validarTelefone(cliente.phone)) {
      avisos.push('Telefone em formato inválido (use formato: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX)');
    }

    if (cliente.mobilePhone && !this.validarTelefone(cliente.mobilePhone)) {
      avisos.push('Celular em formato inválido (use formato: (XX) XXXXX-XXXX)');
    }

    return {
      valido: erros.length === 0,
      erros,
      avisos,
    };
  }

  /**
   * Valida CPF usando algoritmo de dígitos verificadores
   */
  validarCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
      return false;
    }

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) {
      return false;
    }

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(10))) {
      return false;
    }

    return true;
  }

  /**
   * Valida CNPJ usando algoritmo de dígitos verificadores
   */
  validarCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    // Verifica se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) {
      return false;
    }

    // Validação do primeiro dígito verificador
    let tamanho = cnpjLimpo.length - 2;
    let numeros = cnpjLimpo.substring(0, tamanho);
    const digitos = cnpjLimpo.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) {
      return false;
    }

    // Validação do segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpjLimpo.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) {
      return false;
    }

    return true;
  }

  /**
   * Valida email usando regex
   */
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Valida telefone no formato brasileiro
   * Aceita: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
   */
  validarTelefone(telefone: string): boolean {
    // Remove caracteres não numéricos
    const telefoneLimpo = telefone.replace(/\D/g, '');

    // Telefone fixo: 10 dígitos (XX) XXXX-XXXX
    // Celular: 11 dígitos (XX) XXXXX-XXXX
    if (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11) {
      return false;
    }

    // Verifica se o DDD é válido (11 a 99)
    const ddd = parseInt(telefoneLimpo.substring(0, 2));
    if (ddd < 11 || ddd > 99) {
      return false;
    }

    // Se for celular (11 dígitos), o terceiro dígito deve ser 9
    if (telefoneLimpo.length === 11 && telefoneLimpo.charAt(2) !== '9') {
      return false;
    }

    return true;
  }

  /**
   * Sanitiza dados do cliente removendo campos vazios e fazendo trim
   */
  sanitizarDados(cliente: DadosCliente): DadosCliente {
    const clienteSanitizado: any = {};

    // Processa cada campo
    Object.keys(cliente).forEach((key) => {
      const valor = (cliente as any)[key];

      // Pula valores undefined ou null
      if (valor === undefined || valor === null) {
        return;
      }

      // Se for string, faz trim
      if (typeof valor === 'string') {
        const valorTrimmed = valor.trim();
        
        // Só adiciona se não for string vazia
        if (valorTrimmed !== '') {
          clienteSanitizado[key] = valorTrimmed;
        }
      } else {
        // Para outros tipos (boolean, etc), adiciona diretamente
        clienteSanitizado[key] = valor;
      }
    });

    // Limpa CPF/CNPJ removendo caracteres especiais
    if (clienteSanitizado.cpfCnpj) {
      clienteSanitizado.cpfCnpj = clienteSanitizado.cpfCnpj.replace(/\D/g, '');
    }

    // Limpa telefones removendo caracteres especiais
    if (clienteSanitizado.phone) {
      clienteSanitizado.phone = clienteSanitizado.phone.replace(/\D/g, '');
    }

    if (clienteSanitizado.mobilePhone) {
      clienteSanitizado.mobilePhone = clienteSanitizado.mobilePhone.replace(/\D/g, '');
    }

    return clienteSanitizado as DadosCliente;
  }

  /**
   * Formata CPF para exibição (XXX.XXX.XXX-XX)
   */
  formatarCPF(cpf: string): string {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;
    
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Formata CNPJ para exibição (XX.XXX.XXX/XXXX-XX)
   */
  formatarCNPJ(cnpj: string): string {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) return cnpj;
    
    return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  /**
   * Formata telefone para exibição
   */
  formatarTelefone(telefone: string): string {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    
    if (telefoneLimpo.length === 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (telefoneLimpo.length === 11) {
      // Celular: (XX) XXXXX-XXXX
      return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
  }
}

// Exporta instância singleton para uso em toda aplicação
export const clienteValidator = new ClienteValidator();
