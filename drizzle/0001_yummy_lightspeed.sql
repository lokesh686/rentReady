CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`renterId` int NOT NULL,
	`landlordId` int NOT NULL,
	`listingId` int NOT NULL,
	`status` enum('pending','approve','reject') DEFAULT 'pending',
	`notes` text,
	`viewedAt` timestamp,
	`respondedAt` timestamp,
	`paymentStatus` enum('pending','paid','failed') DEFAULT 'pending',
	`stripePaymentIntentId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`documentType` enum('id','income','employment','reference'),
	`fileKey` varchar(255) NOT NULL,
	`fileName` varchar(255),
	`fileSize` int,
	`mimeType` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `landlordProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255),
	`companyType` enum('individual','property-management','corporation'),
	`phoneNumber` varchar(20),
	`address` text,
	`stripeCustomerId` varchar(255),
	`profileComplete` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landlordProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `landlordProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `paymentTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('subscription','packet-fee'),
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`stripeTransactionId` varchar(255),
	`status` enum('pending','succeeded','failed') DEFAULT 'pending',
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paymentTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rentalListings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`landlordId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`address` text NOT NULL,
	`city` varchar(100),
	`state` varchar(50),
	`zipCode` varchar(10),
	`rentAmount` decimal(10,2) NOT NULL,
	`bedrooms` int,
	`bathrooms` decimal(3,1),
	`squareFeet` int,
	`amenities` json,
	`status` enum('active','inactive','filled') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rentalListings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `renterProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`phoneNumber` varchar(20),
	`dateOfBirth` varchar(10),
	`ssn` varchar(11),
	`annualIncome` decimal(12,2),
	`incomeSource` varchar(255),
	`employer` varchar(255),
	`jobTitle` varchar(255),
	`employmentStatus` enum('employed','self-employed','unemployed','student','retired'),
	`references` json,
	`idDocumentKey` varchar(255),
	`incomeDocumentKey` varchar(255),
	`simulatedCreditScore` int DEFAULT 750,
	`idVerified` boolean DEFAULT false,
	`incomeVerified` boolean DEFAULT false,
	`employmentVerified` boolean DEFAULT false,
	`profileComplete` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `renterProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `renterProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `renterSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeSubscriptionId` varchar(255),
	`stripeCustomerId` varchar(255),
	`status` enum('active','expired','cancelled','pending') DEFAULT 'pending',
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`cancelledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `renterSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `renterSubscriptions_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('renter','landlord','admin') NOT NULL DEFAULT 'renter';