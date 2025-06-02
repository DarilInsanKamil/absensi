import { deleteUserById, getUserById, updateUserPassword } from "@/app/libs/features/queryAuth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    try {
        const searchById = await getUserById(id)
        if (!searchById) {
            return new Response(JSON.stringify({ error: "User Not Found" }), {
                status: 404,
                headers: {
                    "Content-type": "application/json"
                }
            })
        }
        return new NextResponse(JSON.stringify(searchById), {
            status: 200,
            headers: {
                "Content-type": "application/json"
            }
        })

    } catch (err) {
        console.error('Error fetching user:', err);
        return new Response(JSON.stringify({ error: "An error occurred while fetching user data" }), {
            status: 500,
            headers: {
                "Content-type": "application/json"
            }
        })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    try {
        const body = await req.json();
        const { password } = body;

        // Validate password
        if (!password || typeof password !== 'string' || password.length < 6) {
            return new Response(JSON.stringify({
                error: "Invalid password. Password must be at least 6 characters long"
            }), {
                status: 400,
                headers: {
                    "Content-type": "application/json"
                }
            });
        }

        const existingUser = await getUserById(id);
        if (!existingUser) {
            return new Response(JSON.stringify({ error: "User Not Found" }), {
                status: 404,
                headers: {
                    "Content-type": "application/json"
                }
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await updateUserPassword(id, hashedPassword);
        console.log('Update result:', updatedUser);

        if (!updatedUser) {
            return new Response(JSON.stringify({ error: "Failed to update password" }), {
                status: 500,
                headers: {
                    "Content-type": "application/json"
                }
            });
        }

        return new Response(JSON.stringify({
            message: "Password updated successfully",
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                updated_at: updatedUser.updated_at
            }
        }), {
            status: 200,
            headers: {
                "Content-type": "application/json"
            }
        });
    } catch (err) {
        console.error('Error updating password:', err);
        return new Response(JSON.stringify({
            error: "An error occurred while updating password"
        }), {
            status: 500,
            headers: {
                "Content-type": "application/json"
            }
        });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const deleteById = await deleteUserById(parseInt(id))
        if (!deleteById) {
            return new Response(JSON.stringify({ error: "User Not Found" }), {
                status: 404,
                headers: {
                    "Content-type": "application/json"
                }
            })
        }
        return new Response(JSON.stringify({ message: "Delete Success" }), {
            status: 200,
            headers: {
                "Content-type": "application/json"
            }
        })
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while deleting data';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                "Content-type": "application/json"
            }
        })
    }
}