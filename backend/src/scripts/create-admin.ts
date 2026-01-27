
import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    console.log('Creating Admin User...');

    const email = 'admin@momope.com';
    const password = 'admin'; // Keeping it simple for dev
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Delete existing admin if any
    const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', email);

    if (deleteError) {
        console.error('Delete Error:', deleteError.message);
    } else {
        console.log('Old Admin Removed (if existed).');
    }

    // 2. Insert fresh admin
    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                full_name: 'MomoPe Admin',
                email: email,
                password_hash: hashedPassword,
                mobile: '9999999999',
                role: 'ADMIN',
                is_verified: true
            }
        ])
        .select()
        .single();

    if (error) {
        console.error('Error creating admin:', error.message);
    } else {
        console.log('✅ Admin User Created Successfully!');
        console.log('Email:', email);
        console.log('Password:', password);
    }
}

createAdmin();
