// src/utils/urlUtils.ts

export function get_validated_URIs(endpoint: string) {
    /** Garante que um endpoint comece e termine com uma barra '/',
     * evitando erros de roteamento e redirecionamentos desnecessários no Django.
    */
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return cleanEndpoint.endsWith('/') ? cleanEndpoint : `${cleanEndpoint}/`
}