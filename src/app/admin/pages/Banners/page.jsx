'use client';
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, Input, Switch, FormLabel, FormControl, Textarea, IconButton, useToast, Image, Tooltip
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';

const emptyBanner = {
  imageUrl: '',
  title: '',
  text: '',
  link: '',
  order: 0,
  active: true,
};

export default function BannersAdmin() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyBanner);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const toast = useToast();

  const fetchBanners = async () => {
    const res = await fetch('/api/banners');
    const data = await res.json();
    setBanners(data);
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'imageFile') {
      setImageFile(files[0]);
    } else {
      setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleEdit = banner => {
    setForm({ ...banner });
    setEditingId(banner._id);
    setShowForm(true);
    setImageFile(null);
  };

  const handleDelete = async id => {
    if (!confirm('حذف هذا البانر؟')) return;
    const res = await fetch('/api/banners', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : '' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast({ title: 'تم حذف البانر', status: 'success' });
      fetchBanners();
    } else {
      toast({ title: 'فشل الحذف', status: 'error' });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (editingId) formData.append('id', editingId);
    if (imageFile) formData.append('image', imageFile);
    const res = await fetch('/api/banners', {
      method,
      headers: { 'Authorization': localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : '' },
      body: formData,
    });
    if (res.ok) {
      toast({ title: editingId ? 'تم تحديث البانر' : 'تمت إضافة البانر', status: 'success' });
      setShowForm(false);
      setEditingId(null);
      setForm(emptyBanner);
      setImageFile(null);
      fetchBanners();
    } else {
      toast({ title: 'فشل الحفظ', status: 'error' });
    }
  };

  // Reorder banners
  const moveBanner = async (idx, direction) => {
    const newOrder = [...banners];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= banners.length) return;
    // Swap order values
    [newOrder[idx].order, newOrder[swapIdx].order] = [newOrder[swapIdx].order, newOrder[idx].order];
    // Update both banners in DB
    await Promise.all([
      fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Authorization': localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : '', },
        body: (() => { const fd = new FormData(); fd.append('id', newOrder[idx]._id); fd.append('order', newOrder[idx].order); return fd; })(),
      }),
      fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Authorization': localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : '', },
        body: (() => { const fd = new FormData(); fd.append('id', newOrder[swapIdx]._id); fd.append('order', newOrder[swapIdx].order); return fd; })(),
      })
    ]);
    fetchBanners();
  };

  // Toggle active status
  const toggleActive = async (banner) => {
    const fd = new FormData();
    fd.append('id', banner._id);
    fd.append('active', !banner.active);
    await fetch('/api/banners', {
      method: 'PUT',
      headers: { 'Authorization': localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : '', },
      body: fd,
    });
    fetchBanners();
  };

  return (
    <Box p={6}>
      <Button leftIcon={<AddIcon />} colorScheme="blue" mb={4} onClick={() => { setShowForm(true); setForm(emptyBanner); setEditingId(null); setImageFile(null); }}>إضافة بانر</Button>
      {showForm && (
        <Box as="form" onSubmit={handleSubmit} mb={6} p={4} borderWidth={1} borderRadius="md" bg="white" boxShadow="md">
          <FormControl mb={2}>
            <FormLabel>الصورة</FormLabel>
            <Input name="imageFile" type="file" accept="image/*" onChange={handleChange} />
            {form.imageUrl && !imageFile && <Image src={form.imageUrl} alt="بانر" boxSize="100px" objectFit="cover" mt={2} />}
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>العنوان</FormLabel>
            <Input name="title" value={form.title} onChange={handleChange} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>الوصف</FormLabel>
            <Textarea name="text" value={form.text} onChange={handleChange} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>الرابط</FormLabel>
            <Input name="link" value={form.link} onChange={handleChange} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>الترتيب</FormLabel>
            <Input name="order" type="number" value={form.order} onChange={handleChange} />
          </FormControl>
          <FormControl display="flex" alignItems="center" mb={2}>
            <FormLabel mb={0}>نشط</FormLabel>
            <Switch name="active" isChecked={form.active} onChange={handleChange} />
          </FormControl>
          <Button colorScheme="green" type="submit" mr={2}>{editingId ? 'تحديث البانر' : 'إضافة بانر'}</Button>
          <Button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyBanner); setImageFile(null); }}>إلغاء</Button>
        </Box>
      )}
      <Table variant="simple" size="md" bg="white" borderRadius="lg" boxShadow="md">
        <Thead>
          <Tr>
            <Th>الصورة</Th>
            <Th>العنوان</Th>
            <Th>الوصف</Th>
            <Th>الرابط</Th>
            <Th>الترتيب</Th>
            <Th>نشط</Th>
            <Th>إجراءات</Th>
          </Tr>
        </Thead>
        <Tbody>
          {banners.map((b, idx) => (
            <Tr key={b._id}>
              <Td><Image src={b.imageUrl} alt={b.title} boxSize="80px" objectFit="cover" /></Td>
              <Td>{b.title}</Td>
              <Td>{b.text}</Td>
              <Td>{b.link}</Td>
              <Td>
                <IconButton icon={<ArrowUpIcon />} size="sm" mr={1} onClick={() => moveBanner(idx, 'up')} isDisabled={idx === 0} />
                <IconButton icon={<ArrowDownIcon />} size="sm" onClick={() => moveBanner(idx, 'down')} isDisabled={idx === banners.length - 1} />
                {b.order}
              </Td>
              <Td>
                <Switch isChecked={b.active} onChange={() => toggleActive(b)} />
              </Td>
              <Td>
                <Tooltip label="تعديل" aria-label="تعديل">
                  <IconButton icon={<EditIcon />} size="sm" mr={2} onClick={() => handleEdit(b)} />
                </Tooltip>
                <Tooltip label="حذف" aria-label="حذف">
                  <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete(b._id)} />
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
} 