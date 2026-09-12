export interface MembershipRequestResponse {
    id: number
    email: string
    firstName?: string
    lastName?: string
    motivationLetter?: string
    cvOriginalFilename?: string
    requestedStatus: string
    establishment?: string
    originLaboratory?: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
    submittedAt: string
    decidedAt?: string
    decidedBy?: string
    rejectionReason?: string
}

export interface RoleHistoryEntry {
    id: number
    role: string
    startDate: string
    endDate?: string
    active: boolean
    changedBy?: string
}

export interface MemberStatusHistoryEntry {
    id: number
    status: string
    startDate: string
    endDate?: string
    active: boolean
    changedBy?: string
    reason?: string
}

export interface LabInfo {
    name: string
    presentation: string
    creationDate: string
    faculty: string
}

export interface PublicMember {
    id: number
    firstName: string
    lastName: string
    photoPath?: string
    biography?: string
    interests?: string
    establishment?: string
    status: string
    team?: string
}

export interface PublicEvent {
    id: number
    title: string
    description?: string
    location?: string
    edition?: string
    website?: string
    startDate: string
    endDate?: string
    type: string
    status: string
}

export interface PublicPublication {
    id: number
    title: string
    journal?: string
    conference?: string
    doi?: string
    url?: string
    authors?: string
    team?: string
    year: number
    type: string
    memberFirstName?: string
    memberLastName?: string
}
export interface CalendarEvent {
    id: number
    title: string
    start: string
    end?: string
    type: string
    location?: string
}

export interface SearchResult {
    type: string
    id: number
    title: string
    subtitle: string
}

export interface MessageThread {
    id: number
    title: string
    type: string
    team?: string
    eventId?: number
    participantIds: number[]
    createdAt: string
}

export interface Message {
    id: number
    threadId: number
    senderId: number
    senderName: string
    senderEmail: string
    content: string
    timestamp: string
}

export interface ThreadRequest {
    title: string
    type: string
    team?: string
    eventId?: number
    participantIds?: number[]
}

export interface ThreadResponse {
    id: number
    title: string
    type: string
    team?: string
    eventId?: number
    participantIds: number[]
    createdAt: string
}

export interface MessageRequest {
    content: string
}

export interface MessageResponse {
    id: number
    threadId: number
    senderId: number
    senderName: string
    senderEmail: string
    content: string
    timestamp: string
}

export interface Convention {
    id: number
    title: string
    partnerName: string
    partnerCountry: string
    startDate: string
    endDate: string
    status: string
    documentFileName?: string
    documentDownloadUrl?: string
    createdAt: string
}

export interface AuditLog {
    id: number
    action: string
    entityType: string
    entityId: number
    actor: string
    changes: string
    timestamp: string
}

export type UserRole = 'VISITOR' | 'MEMBER' | 'DOCTORAL' | 'DIRECTOR' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'FROZEN' | 'DISABLED' | 'PENDING'
export type MemberStatus = 'PERMANENT' | 'ASSOCIATE' | 'DOCTORAL' | 'RETIRED' | 'FORMER'
export type EventType = 'CONFERENCE' | 'SEMINAR' | 'WORKSHOP' | 'OTHER'
export type EventStatus = 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
export type DocumentType = 'FUNDING_REQUEST' | 'PROGRAM' | 'CERTIFICATE' | 'REPORT' | 'ADMINISTRATIVE' | 'OTHER'
export type MeetingStatus = 'PLANNED' | 'COMPLETED' | 'CANCELLED'
export type PublicationType = 'JOURNAL' | 'CONFERENCE' | 'BOOK' | 'THESIS' | 'OTHER'
export type MandateRole = 'DIRECTOR' | 'VICE_DIRECTOR' | 'TEAM_LEADER' | 'TEAM_MEMBER'
export type EquipmentCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'OUT_OF_SERVICE'
export type EquipmentStatus = 'AVAILABLE' | 'ASSIGNED' | 'PARTIALLY_ASSIGNED' | 'OUT_OF_SERVICE'
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED'
export type ThreadType = 'GENERAL' | 'TEAM' | 'EVENT'

export interface AuthResponse {
    token: string
    role: UserRole
    email: string
}

export interface MemberProfile {
    id: number
    userId: number
    email: string
    firstName?: string
    lastName?: string
    photoPath?: string
    biography?: string
    interests?: string
    establishment?: string
    originLaboratory?: string
    hireDate?: string
    birthDate?: string
    status?: MemberStatus
    role: string
    currentTeam?: string
    currentLaboratory?: string
}

export interface AdminMember {
    userId: number
    memberId: number
    email: string
    firstName?: string
    lastName?: string
    userStatus: UserStatus
    userRole: UserRole
    memberStatus?: MemberStatus
    hireDate?: string
    currentLaboratory?: string
    currentTeam?: string
}

export interface Affiliation {
    id: number
    laboratory: string
    team?: string
    startDate: string
    endDate?: string
    active: boolean
}

export interface Publication {
    id: number
    title: string
    journal?: string
    conference?: string
    doi?: string
    url?: string
    authors?: string
    abstractText?: string
    team?: string
    year: number
    type: PublicationType
    memberId?: number
    memberEmail?: string
    memberFirstName?: string
    memberLastName?: string
    createdAt?: string
}

export interface Event {
    id: number
    title: string
    description?: string
    location?: string
    edition?: string
    website?: string
    startDate: string
    endDate?: string
    type: EventType
    status: EventStatus
    organizerId?: number
    organizerFirstName?: string
    organizerLastName?: string
    organizerEmail?: string
    createdAt?: string
}

export interface Meeting {
    id: number
    title: string
    description?: string
    location?: string
    agenda?: string
    date: string
    status: MeetingStatus
    pvFileName?: string
    pvDownloadUrl?: string
    createdById?: number
    createdByEmail?: string
    createdByFirstName?: string
    createdByLastName?: string
    createdAt?: string
}

export interface Document {
    id: number
    fileName: string
    fileType?: string
    fileSize?: number
    type: DocumentType
    description?: string
    eventId?: number
    eventTitle?: string
    uploadedById?: number
    uploadedByEmail?: string
    downloadUrl?: string
    createdAt?: string
}

export interface Notification {
    id: number
    title: string
    message: string
    type: string
    read: boolean
    createdAt: string
}

export interface Equipment {
    id: number
    name: string
    description?: string
    serialNumber: string
    quantity: number
    availableQuantity: number
    arrivalDate: string
    condition: EquipmentCondition
    status: EquipmentStatus
    notes?: string
    assignedToId?: number
    assignedToName?: string
    distributionDate?: string
}

export interface EquipmentRequest {
    id: number
    equipmentName: string
    equipmentDescription?: string
    quantityRequested: number
    justification: string
    requestDate?: string
    status: RequestStatus
    requestedById?: number
    requestedByName?: string
    memberEmail?: string
    validatedByName?: string
    validationNote?: string
}

export interface EquipmentAssignment {
    id: number
    equipmentId: number
    equipmentName: string
    equipmentSerialNumber?: string
    memberId: number
    memberName: string
    quantityAssigned: number
    assignmentDate: string
    returnDate?: string
    assignmentNote?: string
    returnNote?: string
}

export interface Mandate {
    id: number
    memberId: number
    memberFirstName?: string
    memberLastName?: string
    memberEmail?: string
    role: MandateRole
    startDate: string
    endDate?: string
    team?: string
    active: boolean
    createdAt?: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
    VISITOR: 'Visiteur',
    MEMBER: 'Membre',
    DOCTORAL: 'Doctorant',
    DIRECTOR: 'Directeur',
    ADMIN: 'Administrateur',
}

export const STATUS_LABELS: Record<UserStatus, string> = {
    ACTIVE: 'Actif',
    PENDING: 'En attente',
    FROZEN: 'Gelé',
    DISABLED: 'Désactivé',
}
