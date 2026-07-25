import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    institution: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created — welcome to ResearchHub AI");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink bg-paper-grain px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-parchment rounded-sm shadow-2xl p-9"
      >
        <p className="eyebrow">Vol. I — Est. 2026</p>
        <h1 className="font-display text-3xl font-semibold mt-2 mb-1">Create your account</h1>
        <p className="text-sm text-ink-soft mb-7">Join a workspace built for collaborative research.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Ayesha Khan" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="you@university.edu" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} className="input-field" placeholder="At least 6 characters" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field">
                <option>Student</option>
                <option>Professor</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="label">Institution</label>
              <input name="institution" value={form.institution} onChange={handleChange} className="input-field" placeholder="Optional" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-gold-dark font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
