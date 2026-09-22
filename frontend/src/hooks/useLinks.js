import { useState, useCallback } from 'react';
import { linksApi } from '../api/links';

export const useLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLinks = useCallback(async (profileId) => {
    setLoading(true);
    try {
      const data = await linksApi.getLinks(profileId);
      setLinks(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createLink = async (profileId, data) => {
    const newLink = await linksApi.createLink(profileId, data);
    setLinks(prev => [...prev, newLink]);
    return newLink;
  };

  const updateLink = async (profileId, linkId, data) => {
    const updatedLink = await linksApi.updateLink(profileId, linkId, data);
    setLinks(prev => prev.map(l => l.id === linkId ? updatedLink : l));
    return updatedLink;
  };

  const deleteLink = async (profileId, linkId) => {
    await linksApi.deleteLink(profileId, linkId);
    setLinks(prev => prev.filter(l => l.id !== linkId));
  };

  return { links, loading, error, fetchLinks, createLink, updateLink, deleteLink, setLinks };
};
