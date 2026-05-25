export interface AuthResponse {
    token: string;
    role: string;
    email: string;
}

export interface MemberProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    photoPath: string;
    biography: string;
    interests: string;
    establishment: string;
    originLaboratory: string;
    hireDate: string;
    status: string;
    role: string;
    currentTeam: string;
    currentLaboratory: string;
}

export interface Publication {
    id: number;
    title: string;
    journal: string;
    conference: string;
    authors: string;
    year: number;
    type: string;
    team: string;
    memberEmail: string;
    memberFirstName: string;
    memberLastName: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    type: string;
    status: string;
    edition: string;
    website: string;
    organizerEmail: string;
}

export interface Meeting {
    id: number;
    title: string;
    description: string;
    location: string;
    agenda: string;
    date: string;
    status: string;
    pvFileName: string;
    pvDownloadUrl: string;
    createdByEmail: string;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

export interface AdminMember {
    userId: number;
    memberId: number;
    email: string;
    firstName: string;
    lastName: string;
    userStatus: string;
    userRole: string;
    memberStatus: string;
    hireDate: string;
    currentLaboratory: string;
    currentTeam: string;
}