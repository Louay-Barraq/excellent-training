/**
 * Centralized mapping of backend error codes to user-friendly messages.
 * Maps standard HTTP status and technical keys from Spring Boot.
 */
const errorMessages = {
    // Auth errors
    'INVALID_CREDENTIALS': 'Identifiants incorrects ou accès non autorisé.',
    'ACCOUNT_DISABLED': 'Ce compte a été désactivé. Veuillez contacter l\'administrateur.',
    'ACCESS_DENIED': 'Vous n\'avez pas les permissions nécessaires pour cette action.',
    'UNAUTHORIZED': 'Session invalide ou expirée. Veuillez vous reconnecter.',
    'NOT_FOUND': 'Ressource introuvable dans le système.',
    'BAD_REQUEST': 'Requête invalide. Veuillez vérifier les données saisies.',
    'VALIDATION_ERROR': 'Certaines informations sont invalides. Veuillez vérifier les champs.',
    'INTERNAL_ERROR': 'Une erreur interne du serveur est survenue. Veuillez réessayer plus tard.',
    
    // User errors
    'USER_ALREADY_EXISTS': 'Un utilisateur avec cet identifiant existe déjà.',
    'USER_NOT_FOUND': 'Utilisateur introuvable dans le système.',
    
    // Domain / Reference errors
    'REFERENCE_IN_USE': 'Impossible de supprimer cet élément car il est utilisé dans d\'autres modules.',
    'DUPLICATE_LIBELLE': 'Un élément avec ce libellé existe déjà.',
    
    // Common HTTP Errors
    '401': 'Session expirée. Veuillez vous reconnecter.',
    '403': 'Accès refusé.',
    '404': 'Ressource introuvable sur le serveur.',
    '409': 'Cette action ne peut pas être réalisée dans l\'état actuel des données.',
    '500': 'Une erreur interne du serveur est survenue. Veuillez réessayer plus tard.',
    'DEFAULT': 'Une erreur inattendue est survenue.'
};

export const mapError = (errorData) => {
    if (!errorData) return errorMessages.DEFAULT;
    
    // 1. Handle validation errors (Object of field errors from Spring)
    if (typeof errorData === 'object' && errorData.fieldErrors && typeof errorData.fieldErrors === 'object') {
        const firstField = Object.keys(errorData.fieldErrors)[0];
        if (firstField) return `${errorData.fieldErrors[firstField]}`;
    }

    // 2. If message exists and is NOT a recognized technical key, 
    // it's likely a custom descriptive message from the backend.
    if (errorData.message && !errorMessages[errorData.message]) {
        // Simple heuristic: if it contains a space, it's likely a sentence/message
        if (errorData.message.includes(' ') || errorData.message.length > 20) {
            return errorData.message;
        }
    }

    // 3. Check for specific error code from backend field
    if (errorData.code && errorMessages[errorData.code]) {
        return errorMessages[errorData.code];
    }
    
    // 4. Check for standard "error" field (GlobalExceptionHandler)
    if (errorData.error) {
        return errorData.error;
    }

    // 5. Check for standard "message" field mappings
    if (errorData.message && errorMessages[errorData.message]) {
        return errorMessages[errorData.message];
    }

    // 6. Fallback to HTTP status if present
    if (errorData.status && errorMessages[errorData.status.toString()]) {
        return errorMessages[errorData.status.toString()];
    }

    return errorData.message || errorMessages.DEFAULT;
};

export const errorMapper = {
    mapError
};
